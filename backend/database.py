import sqlite3
import json
import datetime

from flask_bcrypt import Bcrypt


# CART TABLE
def create_cart_table():
    sqliteConnection = sqlite3.connect('sql.db')
    cursor = sqliteConnection.cursor()
    cursor.execute(
        'create table cart (StoreId int, ItemId int, CustomerId int, Quantity int, Price Decimal(10,2), ItemName varchar(100), OrderId varchar(30));')
    cursor.close()
    print("Done")


def insert_into_table_cart(StoreId, ItemId, CustomerID, Quantity, Price, ItemName):
    sqliteConnection = sqlite3.connect('sql.db')
    cursor = sqliteConnection.cursor()
    cursor.execute("INSERT INTO cart (StoreId, ItemId, CustomerID, Quantity, Price, ItemName) VALUES (?, ?, ?, ?, ?, ?);",
                   (StoreId, ItemId, CustomerID, Quantity, Price, ItemName))
    cursor.execute("Select * from cart;")
    result = cursor.fetchall()
    print(result)
    sqliteConnection.commit()
    cursor.close()
    print("Done")


def select_user_cart(CustomerId):
    sqliteConnection = sqlite3.connect('sql.db')
    cursor = sqliteConnection.cursor()
    cursor.execute("SELECT * FROM cart WHERE CustomerId=?;", (CustomerId,))
    # cursor.execute("Select * from cart;")
    result = cursor.fetchall()
    print(result)
    cursor.close()
    return result


def change_quantity_cart(Item, SelectedValue):
    sqliteConnection = sqlite3.connect('sql.db')
    cursor = sqliteConnection.cursor()
    print((Item["store_Id"], Item["Item_Id"],
          Item["Customer_Id"], SelectedValue))
    cursor.execute("UPDATE cart SET Quantity = ? WHERE StoreId = ? AND ItemId = ? AND CustomerId = ?;",
                   (int(SelectedValue), Item["store_Id"], Item["Item_Id"], Item["Customer_Id"]))
    sqliteConnection.commit()
    cursor.close()
    print("Done")


def add_order_id(customer_id, order_id):
    sqliteConnection = sqlite3.connect('sql.db')
    cursor = sqliteConnection.cursor()
    cursor.execute("UPDATE cart SET OrderID=? WHERE CustomerID=?;",
                   (order_id, customer_id))
    sqliteConnection.commit()
    cursor.close()


# def create_user_table():
#     sqliteConnection = sqlite3.connect('sql.db')
#     cursor = sqliteConnection.cursor()
#     cursor.execute(
#         'create table users (username varchar(100), password varchar(100),type int);')
#     cursor.close()
#     print("Done")
def Check_Valid_User(username, password):
    sqliteConnection = sqlite3.connect('sql.db')
    cursor = sqliteConnection.cursor()
    cursor.execute(
        "SELECT * FROM users WHERE username=? AND password=?;", (username, password))
    result = cursor.fetchall()
    cursor.close()
    return result


def Add_User(username, password, type):
    sqliteConnection = sqlite3.connect('sql.db')
    cursor = sqliteConnection.cursor()
    cursor.execute(
        "INSERT INTO users (username, password,type) VALUES (?, ?, ?);", (username, password, type))
    sqliteConnection.commit()
    cursor.close()
    print("Done")


# ORDERS TABLE
def create_orders_table():
    sqliteConnection = sqlite3.connect('sql.db')
    cursor = sqliteConnection.cursor()

    cursor.execute('CREATE TABLE IF NOT EXISTS orders (StoreId int, ItemId int, CustomerId int, Quantity int, Price Decimal(10,2), ItemName varchar(100), OrderId varchar(30) PRIMARY KEY, OrderStatus varchar(30), OrderDate DATE, OrderTime TIME, FOREIGN KEY (ItemId) REFERENCES inventory(ItemId));')

    sqliteConnection.commit()
    cursor.close()
    print("Orders table created successfully.")


def update_cart(order_id, order_status):
    sqliteConnection = sqlite3.connect('sql.db')
    cursor = sqliteConnection.cursor()

    current_datetime = datetime.datetime.now()

    order_date = current_datetime.date()
    order_time = current_datetime.time()

    cursor.execute("SELECT * FROM cart WHERE OrderId = ?;", (order_id,))
    rows = cursor.fetchall()

    for row in rows:
        cursor.execute("INSERT INTO orders (StoreId, ItemId, CustomerId, Quantity, Price, ItemName, OrderId, OrderStatus, OrderDate, OrderTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? );",
                       (row[0], row[1], row[2], row[3], row[4], row[5], order_id, order_status, order_date, order_time,))

    if order_status == "complete":
        cursor.execute("DELETE FROM cart WHERE OrderId = ?;", (order_id,))

    sqliteConnection.commit()
    cursor.close()
    print("Rows retrieved from cart and inserted into Orders successfully")


def retrieve_orders_by_vendor(vendor_id):
    sqliteConnection = sqlite3.connect('sql.db')
    cursor = sqliteConnection.cursor()

    cursor.execute(
        "SELECT * FROM orders o JOIN inventory i ON o.ItemId = i.ItemId WHERE i.VendorID = ?", (vendor_id,))
    rows = cursor.fetchall()

    orders = []
    for row in rows:
        order = {
            "StoreId": row[0],
            "ItemId": row[1],
            "CustomerId": row[2],
            "Quantity": row[3],
            "Price": float(row[4]),
            "ItemName": row[5],
            "OrderId": row[6],
            "OrderStatus": row[7],
            "OrderDate": str(row[8]),
            "OrderTime": str(row[9])
        }
        orders.append(order)

    cursor.close()
    sqliteConnection.close()

    return json.dumps(orders, indent=4)


# USER TABLE
def create_user_table():
    sqliteConnection = sqlite3.connect('sql.db')
    cursor = sqliteConnection.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='User';")
    table_exists = cursor.fetchone()
    if not table_exists:
        cursor.execute("CREATE TABLE User (UserId INTEGER PRIMARY KEY, AccountType TEXT, Email TEXT UNIQUE NOT NULL, Name TEXT NOT NULL, Password TEXT NOT NULL, StoreID INTEGER NOT NULL, PhoneNumber INTEGER NOT NULL CHECK (AccountType IN ('vendor', 'customer')));")
        sqliteConnection.commit()
    cursor.close()
    sqliteConnection.close()

def create_invitationcodes_table():
    sqliteConnection = sqlite3.connect('sql.db')
    cursor = sqliteConnection.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='InvitationCodes';")
    table_exists = cursor.fetchone()
    if not table_exists:
        cursor.execute("CREATE TABLE InvitationCodes (StoreId INTEGER UNIQUE, InvitationCode INTEGER UNIQUE);")
        sqliteConnection.commit()
    cursor.close()
    sqliteConnection.close()

def insert_into_invitationcodes_table():
    sqliteConnection = sqlite3.connect('sql.db')
    cursor = sqliteConnection.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='InvitationCodes';")
    table_exists = cursor.fetchone()
    if not table_exists:
        create_invitationcodes_table()
    cursor.execute("INSERT INTO InvitationCodes VALUES (1, 1111);")
    cursor.execute("INSERT INTO InvitationCodes VALUES (2, 2222);")
    cursor.execute("INSERT INTO InvitationCodes VALUES (3, 3333);")
    cursor.execute("INSERT INTO InvitationCodes VALUES (4, 4444);")
    cursor.execute("INSERT INTO InvitationCodes VALUES (5, 5555);")
    cursor.execute("INSERT INTO InvitationCodes VALUES (6, 6666);")
    cursor.execute("INSERT INTO InvitationCodes VALUES (7, 7777);")
    cursor.execute("INSERT INTO InvitationCodes VALUES (8, 8888);")
    cursor.execute("INSERT INTO InvitationCodes VALUES (9, 9999);")
    sqliteConnection.commit()
    cursor.close()
    sqliteConnection.close()

def check_email(email):
    sqliteConnection = sqlite3.connect('sql.db')
    cursor = sqliteConnection.cursor()
    cursor.execute('SELECT userid FROM User WHERE Email = ?', (email,))
    result = cursor.fetchone()
    userID = result[0] if result else -1
    cursor.close()
    sqliteConnection.close()
    return userID


def check_password(userID, password):
    sqliteConnection = sqlite3.connect('sql.db')
    cursor = sqliteConnection.cursor()
    cursor.execute('SELECT Password FROM User WHERE UserId = ?', (userID,))
    hashed = cursor.fetchone()
    cursor.close()
    sqliteConnection.close()
    # if Bcrypt.check_password_hash(hashed, password):
    if (hashed[0] == password):
        return True
    else:
        return False
    
def check_invitation_code(invitationCode):
    sqliteConnection = sqlite3.connect('sql.db')
    cursor = sqliteConnection.cursor()
    cursor.execute("SELECT StoreId FROM InvitationCodes WHERE InvitationCode = ?;", (invitationCode,))
    result = cursor.fetchone()
    cursor.close()
    sqliteConnection.close()
    shopID = result[0] if result else -1
    return shopID

def get_user_details(user_id):
    sqliteConnection = sqlite3.connect('sql.db')
    cursor = sqliteConnection.cursor()
    cursor.execute(
        "SELECT UserId, AccountType, Email, Name, StoreID, PhoneNumber FROM User WHERE UserId = ?", (user_id,))
    user_data = cursor.fetchone()
    cursor.close()
    sqliteConnection.close()
    return user_data

def add_customer_details(email, name, password, accountType, invitationCode, phoneNumber):
    sqliteConnection = sqlite3.connect('sql.db')
    cursor = sqliteConnection.cursor()
    cursor.execute("select UserId from User;")
    result = cursor.fetchall()
    if result:
        customer_id = max(result[0])+1
    else:
        customer_id = 1
    
    if accountType == "vendor":
        cursor.execute("SELECT StoreId FROM InvitationCodes WHERE InvitationCode = ?;", (invitationCode,))
        shop_id = cursor.fetchone()[0]
    else: 
        shop_id = -1
    cursor.execute("insert into User values (?, ?, ?, ?, ?, ?, ?);",
                   (customer_id, str(accountType), str(email), str(name), str(password), shop_id, phoneNumber))
    sqliteConnection.commit()

    cursor.close()
    
def create_store_table():
    sqliteConnection = sqlite3.connect('sql.db')
    cursor = sqliteConnection.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='Store';")
    table_exists = cursor.fetchone()
    if not table_exists:
        cursor.execute("CREATE TABLE Store (StoreId INTEGER, ItemId INTEGER, Quantity int, Price Decimal(10,2), ItemName varchar(100),Image BLOB, PRIMARY KEY (StoreId, ItemId) );")
        sqliteConnection.commit()
    # cursor.execute("ALTER TABLE Store ADD COLUMN Image BLOB;")
    # sqliteConnection.commit()
    cursor.close()
    sqliteConnection.close()

def insert_into_table_Store(StoreId, ItemId, Quantity, Price, ItemName,Image):
    sqliteConnection = sqlite3.connect('sql.db')
    cursor = sqliteConnection.cursor()
    cursor.execute("INSERT INTO Store (StoreId, ItemId, Quantity, Price, ItemName,Image) VALUES (?, ?, ?, ?, ?,?);",
                   (StoreId, ItemId, Quantity, Price, ItemName,Image))
    cursor.execute("Select * from Store;")
    result = cursor.fetchall()
    print(result)
    sqliteConnection.commit()
    cursor.close()
    print("Done")
    
def select_store_items(StoreId):
    sqliteConnection = sqlite3.connect('sql.db')
    cursor = sqliteConnection.cursor()
    cursor.execute("SELECT * FROM Store WHERE StoreId=?;", (StoreId,))
    # cursor.execute("Select * from cart;")
    result = cursor.fetchall()
    print(result)
    cursor.close()
    return result




# INVENTORY TABLE

def create_inventory_table():
    sqliteConnection = sqlite3.connect('sql.db')
    cursor = sqliteConnection.cursor()

    cursor.execute('CREATE TABLE IF NOT EXISTS inventory (VendorId int, VendorName varchar(50), StoreId int, ItemId int, ItemName varchar(100), ItemDesc varchar(500), ItemImage BLOB, Quantity int, Price Decimal(10,2));')

    sqliteConnection.commit()
    cursor.close()
    print("Inventory table created successfully.")


def add_to_inventory(vendor_id, vendor_name, item_id, item_name, item_desc, image, store_id, quantity, price):
    sqliteConnection = sqlite3.connect('sql.db')
    cursor = sqliteConnection.cursor()
    cursor.execute("INSERT INTO inventory (VendorId, VendorName, StoreId, ItemId, ItemName, ItemDesc, ItemImage, Quantity, Price) VALUES (?, ?, ?, ?, ?, ?, ?,?, ?);",
                   (vendor_id, vendor_name, store_id, item_id, item_name, item_desc, image, quantity, price,))
    sqliteConnection.commit()
    cursor.close()


def retrieve_data_from_inventory(vendor_id):
    sqliteConnection = sqlite3.connect('sql.db')
    cursor = sqliteConnection.cursor()
    cursor.execute("SELECT * FROM inventory WHERE VendorId = ?", (vendor_id,))
    columns = [column[0] for column in cursor.description]
    rows = cursor.fetchall()

    data = []
    for row in rows:
        row_data = {}
        for i in range(len(columns)):
            row_data[columns[i]] = row[i]
        data.append(row_data)


    cursor.close()
    sqliteConnection.close()
    return json.dumps(data, indent=4)

def get_email(customer_id):
    sqliteConnection = sqlite3.connect('sql.db')
    cursor = sqliteConnection.cursor()
    cursor.execute('SELECT EMAIL FROM User WHERE UserId = ?', (customer_id,))
    result = cursor.fetchone()
    userID = result[0] if result else -1
    cursor.close()
    sqliteConnection.close()
    return userID
def delete(item_id,vendor_id):
    sqliteConnection = sqlite3.connect('sql.db')
    cursor = sqliteConnection.cursor()
    cursor.execute("DELETE FROM Store WHERE StoreId = ? and ItemId = ?;", (vendor_id,item_id))
    cursor.close()
    sqliteConnection.commit()
    sqliteConnection.close()
def updateitem(item_id,vendor_id,item_name,Quantity,Price):
    sqliteConnection = sqlite3.connect('sql.db')
    cursor = sqliteConnection.cursor()
    cursor.execute("Update Store set Quantity = ?,Price = ?,ItemName = ? where ItemId = ? and StoreId = ?;", (Quantity,Price,item_name,item_id,vendor_id))
    cursor.close()
    print("UPDATED")
    sqliteConnection.commit()
    sqliteConnection.close()

if __name__ == "__main__":
    # create_cart_table()
    # create_user_table()
    create_orders_table()
    create_inventory_table()
    create_invitationcodes_table()
    # create_store_table()
    # insert_into_invitationcodes_table()