from datetime import datetime
import json
from collections import defaultdict

import database
import razorpay
from flask import Flask, jsonify, redirect, request, render_template
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, logout_user, current_user

receipt_num = 1
shipping_cost = 100

# Using test mode key and key secret for testing purposes
client = razorpay.Client(
    auth=('rzp_test_BXNSan3NdLPrPa', 'jQLMopwxI1FrtqnrHg3j9e3R'))
client.set_app_details({"title": "Bharatshaala", "version": "0.1.0"})


def get_amount(customer_id):
    cart_items = database.select_user_cart(customer_id)
    total_amount = 0
    for item in cart_items:
        total_amount += item[3] * item[4]
    return total_amount


api = Flask(__name__)
bcrypt = Bcrypt(api)

api.secret_key = '12aj2k4j3lj5nlsklq24534'
login_manager = LoginManager(api)


class User(UserMixin):
    def __init__(self, user_id, account_type, email, name, shopid, phone):
        self.id = user_id
        self.account_type = account_type
        self.email = email
        self.name = name 
        self.shopid = shopid
        self.phone = phone


@login_manager.user_loader
def load_user(user_id):
    userdata = database.get_user_details(user_id)
    print(1)
    if userdata:
        return User(user_id, userdata[1], userdata[2], userdata[3], userdata[4], userdata[5])
    else:
        return None


@api.route('/Cart')
def my_profile():
    if current_user.is_authenticated:
        print(current_user.id)
        data = database.select_user_cart(current_user.id)
        print(data)
        response_body = jsonify(data)
        return response_body
    else:
        return ('', 204)


@api.route('/getTotalAmount')
def get_total_amount():
    total_amount = get_amount(int(current_user.id))
    return jsonify({'totalAmount': total_amount})


@api.route('/getShippingCost')
def get_shipping_cost():
    global shipping_cost
    return jsonify({'shippingCost': shipping_cost})


@api.route('/createOrder')
def create_order():
    global receipt_num
    global shipping_cost
    total_amount = (get_amount(int(current_user.id))+shipping_cost)*100
    currency = "INR"
    receipt_id = "rp" + str(receipt_num)
    receipt_num += 1
    data = {"amount": str(total_amount),
            "currency": currency, "receipt": receipt_id}
    order_details = client.order.create(data=data)

    database.add_order_id(int(current_user.id), order_details['id'])

    return jsonify(order_details)


@api.route('/authenticate', methods=['GET', 'POST'])
def authenticate_payment():
    razorpay_payment_id = request.form['razorpay_payment_id']
    razorpay_order_id = request.form['razorpay_order_id']
    razorpay_signature = request.form['razorpay_signature']

    response = client.utility.verify_payment_signature({
        'razorpay_order_id': razorpay_order_id,
        'razorpay_payment_id': razorpay_payment_id,
        'razorpay_signature': razorpay_signature
    })
    if response:
        order_status = "complete"
        database.update_cart(razorpay_order_id, order_status)
        return redirect('/bag')
    else:
        order_status = "incomplete"
        database.update_cart(razorpay_order_id, order_status)
        return redirect('/bag')


@api.route('/ChangeQuantity', methods=['POST'])
def change_quantity():
    print(request.data)
    data = request.json
    database.change_quantity_cart(data["item"], data["selectedValue"])
    print("Done")
    return ('', 204)


@api.route('/Item', methods=['POST'])
def add_to_cart():
    if current_user.is_authenticated:
        print("USER LOGGED ON")
        print(request.data)
        data = request.json
        data = data["item"]
        current_cart = database.select_user_cart(current_user.id)
        for i in current_cart:
            if i[0] == data["store_id"] and i[1] == data["id"] and i[2] == int(current_user.id):
                print("dup")
                return ('', 204)
        database.insert_into_table_cart(
            data["store_id"], data["id"], current_user.id, 1, data["price"], data["name"])
        print("done")
        return ('', 204)
    else:
        return ('', 204)


@api.route('/AuthenticateEmail', methods=['POST'])
def authenticate_email():
    data = request.json
    email = data.get("email")
    if not email:
        return jsonify({'exists': False, 'message': 'Email missing'}), 200
    userID = database.check_email(email)
    if userID < 0:
        return jsonify({'exists': False, 'message': 'Email is not registered'}), 200
    else:
        return jsonify({'exists': True, 'message': 'Email is registered'}), 200


@api.route('/AuthenticatePassword', methods=['POST'])
def authenticate_password():
    data = request.json
    email = data['email']
    password = data['password']
    if not email or not password:
        return jsonify({'valid': False, 'message': 'Email or password missing'}), 200
    userID = database.check_email(email)
    if userID < 0:
        return jsonify({'exists': False, 'message': 'Email is not registered'}), 200
    validity = database.check_password(userID, password)
    if validity:
        return jsonify({'valid': True, 'message': 'Password is valid'}), 200
    else:
        return jsonify({'valid': False, 'message': 'Invalid password'}), 200


@api.route('/Login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']
    if not email or not password:
        return jsonify({'valid': False, 'message': 'Email or password missing'}), 200
    userID = database.check_email(email)
    if userID < 0:
        return jsonify({'exists': False, 'message': 'Email is not registered'}), 200
    validity = database.check_password(userID, password)
    if not validity:
        return jsonify({'valid': False, 'message': 'Invalid password'}), 200
    user = load_user(userID)
    if user:
        login_user(user)
        # print(current_user.id, current_user.email, current_user.account_type)
        return jsonify({'valid': True, 'message': 'Login successful'}), 200
    else:
        return jsonify({'valid': False, 'message': 'User not found'}), 200

@api.route('/Logout', methods=['POST'])
def logout():
    logout_user()
    return ('', 204)

@api.route('/AuthenticateEmailSignUp', methods=['POST'])
def authenticate_email_Signup():
    data = request.json
    email = data.get("email")
    if not email:
        return jsonify({'exists': False, 'message': 'Email missing'}), 200
    userID = database.check_email(email)
    if userID >= 0:
        return jsonify({'exists': False, 'message': 'Email is not registered'}), 200
    else:
        return jsonify({'exists': True, 'message': 'Email is registered'}), 200
    
@api.route('/AuthenticateInvitationCode', methods=['POST'])
def authenticate_invitation_code():
    data = request.json
    code = data.get("value")
    if not code:
        return jsonify({'exists': False, 'message': 'Invitation code missing'}), 200
    shopID = database.check_invitation_code(code)
    if shopID >= 0:
        return jsonify({'exists': True, 'message': 'Invitation code is registered'}), 200
    else:
        return jsonify({'exists': False, 'message': 'Invitation code is not registered'}), 200
 

@api.route('/Signup',methods=['POST'])
def signup():
    data = request.json
    print(data)
    database.add_customer_details(data["email"],data["name"],data["password"],data["accountType"],data["invitationCode"],data["phoneNumber"])
    userID = database.check_email(data["email"])
    user=load_user(userID)
    login_user(user)
    return ('', 204)

@api.route('/Store')
def my_shop():
    store = 1
    data = database.select_store_items(store)
    print(data)
    response_body = jsonify(data)
    return response_body

# data for vendor dashboard
@api.route('/inventory')
def get_inventory_data():
    inventory_data = database.retrieve_data_from_inventory(1)
    return jsonify(inventory_data)


@api.route('/orderData')
def get_vendor_orders():
    order_data = database.retrieve_orders_by_vendor(1)
    orders = json.loads(order_data)

    item_revenue = {}

    for order in orders:
        item_id = order["ItemId"]
        item_name = order["ItemName"]
        price = order["Price"]
        quantity = order["Quantity"]
        revenue = price * quantity

        if item_id in item_revenue:
            item_revenue[item_id]["revenue"] += revenue
            item_revenue[item_id]["Quantity"] += quantity
        else:
            item_revenue[item_id] = {
                "ItemName": item_name,
                "Price": price,
                "Quantity": quantity,
                "revenue": revenue
            }

    sorted_item_revenue = sorted(
        item_revenue.values(), key=lambda x: x["revenue"], reverse=True)

    return jsonify(sorted_item_revenue)


@api.route('/monthlyRevenue')
def get_monthly_revenue():
    order_data = database.retrieve_orders_by_vendor(1)
    orders = json.loads(order_data)

    monthly_revenue = defaultdict(float)

    # Parse order data and calculate revenue per month
    for order in orders:
        order_date = datetime.strptime(order["OrderDate"], "%Y-%m-%d")
        revenue = order["Price"] * order["Quantity"]
        # Month and year key
        key = f"{order_date.strftime('%B')} {order_date.year}"
        monthly_revenue[key] += revenue

    # Prepare data for line plot
    sales_data = [{"month": month, "revenue": revenue}
                  for month, revenue in monthly_revenue.items()]

    return jsonify(sales_data)

@api.route('/CustomerOrder')
def get_vendor_orders_to_ship():
    order_data = database.retrieve_orders_by_vendor(1)
    orders = json.loads(order_data)

    item = {}
    for order in orders:
        cust_email = database.get_email(order["CustomerId"])
        item_id = order["ItemId"]
        item_name = order["ItemName"]
        price = order["Price"]
        quantity = order["Quantity"]
        revenue = price * quantity
        status = order["OrderStatus"]
        date = order["OrderDate"]
        order_id=order["OrderId"]
        if status=="pending":
            item[order_id]={
                "ItemName": item_name,
                "Price": price,
                "Quantity": quantity,
                "Date" : date,
                "CustomerContact" : cust_email
            }
    print(item)
    return jsonify(item)

@api.route('/delete-item/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    database.delete(item_id,1)
    return jsonify({'message': f'Item with ID {item_id} deleted successfully'})

@api.route('/savechanges', methods=['POST'])
def edititem():
    data = request.json
    print(data)
    if data["quantity"].isnumeric() and data["price"].isnumeric():
        print("Here")
        database.updateitem(data["itemId"],1,data["itemName"],int(data["quantity"]),int(data["price"]))
        return ('', 204)
    else:
        print("There")
        return ('Error',204)

@api.route('/AddItem',methods=['POST'])
def addnew():
    data = request.json
    print(data)
    items=database.select_store_items(1)
    print(items)
    max_second_element = max(items, key=lambda x: x[1])[1]
    item_id=max_second_element+1
    database.insert_into_table_Store(1,item_id,int(data["quantity"]),int(data["price"]),data["itemName"])
    return ('',204)
    
@api.route('/SendOTP', methods=['POST'])
def send_otp():
    phone_number = request.json.get('phone_number')
    return jsonify({'success': True, 'otp': "1234"}) 

@api.route('/GetUser', methods=['GET'])
def get_user():
    if current_user.is_authenticated:
        return jsonify({"loggedIn": True, 
                        "userID": current_user.id, 
                        "accountType": current_user.account_type, 
                        "email": current_user.email, 
                        "name":  current_user.name, 
                        "shopID": current_user.shopid, 
                        "phoneNumber": current_user.phone})
    else:
        return jsonify({"loggedIn": False})
