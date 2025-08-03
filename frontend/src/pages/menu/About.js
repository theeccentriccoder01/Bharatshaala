import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import '../../App.css';

const About = () => {
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('story');

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const sections = [
        { id: 'story', name: 'हमारी कहानी', icon: '📚' },
        { id: 'mission', name: 'हमारा मिशन', icon: '🎯' },
        { id: 'team', name: 'हमारी टीम', icon: '👥' },
        { id: 'values', name: 'हमारे मूल्य', icon: '💎' }
    ];

    const founders = [
        {
            id: 1,
            name: 'राज शर्मा',
            nameEn: 'Raj Sharma',
            role: 'सह-संस्थापक और सीईओ',
            roleEn: 'Co-Founder & CEO',
            description: 'ई-कॉमर्स और डिजिटल मार्केटिंग में 15 साल का अनुभव। भारतीय हस्तशिल्प के प्रति गहरा प्रेम।',
            image: '/images/team/raj-sharma.jpg',
            linkedin: '#',
            twitter: '#',
            background: 'IIT दिल्ली से कंप्यूटर साइंस, पूर्व में Flipkart और Amazon में काम',
            achievements: ['Best Startup Award 2023', 'Digital India Champion', 'E-commerce Excellence']
        },
        {
            id: 2,
            name: 'प्रिया पटेल',
            nameEn: 'Priya Patel',
            role: 'सह-संस्थापक और सीटीओ',
            roleEn: 'Co-Founder & CTO',
            description: 'टेक्नोलॉजी और इनोवेशन की विशेषज्ञ। AI और ML के क्षेत्र में अग्रणी।',
            image: '/images/team/priya-patel.jpg',
            linkedin: '#',
            twitter: '#',
            background: 'IIT बॉम्बे से टेक्नोलॉजी, Google और Microsoft में वरिष्ठ पद',
            achievements: ['Tech Innovation Award', 'AI Excellence', 'Women in Tech Leader']
        },
        {
            id: 3,
            name: 'अमित कुमार',
            nameEn: 'Amit Kumar',
            role: 'मुख्य डिज़ाइन अधिकारी',
            roleEn: 'Chief Design Officer',
            description: 'UX/UI डिज़ाइन और ब्रांडिंग के क्षेत्र में 12 साल का अनुभव। भारतीय कला से प्रेरित डिज़ाइन।',
            image: '/images/team/amit-kumar.jpg',
            linkedin: '#',
            twitter: '#',
            background: 'NID अहमदाबाद से डिज़ाइन, Adobe और Zomato में काम',
            achievements: ['Design Excellence Award', 'Brand Innovation', 'Creative Leadership']
        }
    ];

    const stats = [
        { number: '50+', label: 'बाजार', icon: '🏪' },
        { number: '1000+', label: 'विक्रेता', icon: '👨‍💼' },
        { number: '25000+', label: 'उत्पाद', icon: '📦' },
        { number: '5⭐', label: 'रेटिंग', icon: '⭐' }
    ];

    const values = [
        {
            icon: '🌿',
            title: 'प्रामाणिकता',
            description: 'हम केवल असली और प्रमाणित उत्पाद बेचते हैं'
        },
        {
            icon: '🤝',
            title: 'विश्वास',
            description: 'ग्राहकों और विक्रेताओं के साथ पारदर्शी संबंध'
        },
        {
            icon: '🎨',
            title: 'परंपरा',
            description: 'भारतीय कला और शिल्प को संरक्षित करना'
        },
        {
            icon: '🚀',
            title: 'नवाचार',
            description: 'आधुनिक तकनीक के साथ पारंपरिक व्यापार'
        }
    ];

    if (loading) {
        return <LoadingSpinner message="हमारे बारे में जानकारी लोड हो रही है..." />;
    }

    return (
        <React.StrictMode>
            <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 pt-20'>

                {/* Hero Section */}
                <div className='relative overflow-hidden'>
                    <div className='max-w-6xl mx-auto px-6 py-16 relative z-10'>
                        <div className='text-center mb-16'>
                            <div className='inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full px-6 py-3 mb-6 shadow-lg border border-emerald-200'>
                                <span className='text-2xl'>🏛️</span>
                                <span className='text-emerald-800 font-bold'>हमारे बारे में</span>
                            </div>
                            
                            <h1 className='text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-800 bg-clip-text text-transparent mb-6 leading-tight'>
                                भारतशाला की कहानी
                            </h1>
                            
                            <p className='text-xl md:text-2xl text-emerald-700 max-w-4xl mx-auto leading-relaxed font-medium'>
                                भारतीय बाजार वास्तव में कुछ प्रामाणिक और शानदार उत्पाद प्रदान करते हैं,<br/>
                                चाहे वह कपड़े हों, मसाले हों, या आभूषण हों।
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className='max-w-7xl mx-auto px-6 mb-20'>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
                        {stats.map((stat, index) => (
                            <div key={index} className='bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-emerald-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105'>
                                <div className='text-3xl mb-3'>{stat.icon}</div>
                                <div className='text-3xl font-bold text-emerald-600 mb-2'>{stat.number}</div>
                                <div className='text-emerald-700 font-medium'>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className='max-w-4xl mx-auto px-6 mb-12'>
                    <div className='bg-white/90 backdrop-blur-sm rounded-2xl p-2 shadow-lg'>
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
                                        activeSection === section.id
                                            ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md'
                                            : 'text-emerald-600 hover:bg-emerald-50'
                                    }`}
                                >
                                    <span className='text-lg'>{section.icon}</span>
                                    <span className='font-medium'>{section.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className='max-w-6xl mx-auto px-6 pb-20'>
                    
                    {/* Our Story */}
                    {activeSection === 'story' && (
                        <div className='bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg'>
                            <h2 className='text-3xl font-bold text-emerald-800 mb-6 flex items-center space-x-3'>
                                <span>📚</span>
                                <span>हमारी कहानी</span>
                            </h2>
                            
                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-center'>
                                <div className='space-y-6'>
                                    <p className='text-lg text-emerald-700 leading-relaxed'>
                                        <span className='font-bold text-2xl text-emerald-600'>भारतशाला</span> का जन्म एक सपने से हुआ - 
                                        भारत के पारंपरिक बाजारों को डिजिटल दुनिया से जोड़ने का सपना। हमारा लक्ष्य इन क्षेत्रीय बाजारों को 
                                        हमारी वेबसाइट पर पेश करना है ताकि हर कोई उन तक पहुंच सके।
                                    </p>
                                    
                                    <p className='text-lg text-emerald-700 leading-relaxed'>
                                        हमारा उद्देश्य इन दुकानदारों और विक्रेताओं को लेकर उनके सामान को जनता के लिए दृश्यमान और 
                                        हमेशा पहुंचने योग्य बनाना है, जबकि उपयोगकर्ता डिजिटल रूप से खरीदारी करने और इन बाजारों का 
                                        अनुभव करने में सक्षम हैं।
                                    </p>

                                    <div className='bg-emerald-50 rounded-xl p-6 border border-emerald-200'>
                                        <h3 className='font-bold text-emerald-800 mb-3'>हमारा दृष्टिकोण</h3>
                                        <p className='text-emerald-700'>
                                            "प्रत्येक भारतीय बाजार की अनूठी संस्कृति और परंपरा को डिजिटल युग में संरक्षित करना"
                                        </p>
                                    </div>
                                </div>
                                
                                <div className='relative'>
                                    <div className='bg-gradient-to-br from-emerald-400 to-green-500 rounded-3xl p-8 text-white text-center'>
                                        <div className='text-6xl mb-4'>🏪</div>
                                        <h3 className='text-2xl font-bold mb-4'>2023 में स्थापित</h3>
                                        <p className='text-emerald-100'>
                                            भारतीय व्यापारिक परंपरा को आधुनिक तकनीक से जोड़कर एक नया अध्याय शुरू किया
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Our Mission */}
                    {activeSection === 'mission' && (
                        <div className='bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg'>
                            <h2 className='text-3xl font-bold text-emerald-800 mb-6 flex items-center space-x-3'>
                                <span>🎯</span>
                                <span>हमारा मिशन</span>
                            </h2>
                            
                            <div className='space-y-8'>
                                <div className='text-center'>
                                    <p className='text-xl text-emerald-700 leading-relaxed max-w-4xl mx-auto'>
                                        भारत के पारंपरिक बाजारों को डिजिटल प्लेटफॉर्म पर लाना और स्थानीय कारीगरों, 
                                        शिल्पकारों और व्यापारियों को वैश्विक बाजार से जोड़ना।
                                    </p>
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                                    <div className='bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200'>
                                        <div className='text-3xl mb-4 text-center'>🌐</div>
                                        <h3 className='font-bold text-blue-800 mb-3 text-center'>वैश्विक पहुंच</h3>
                                        <p className='text-blue-700 text-center'>
                                            भारतीय उत्पादों को दुनिया भर के ग्राहकों तक पहुंचाना
                                        </p>
                                    </div>

                                    <div className='bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200'>
                                        <div className='text-3xl mb-4 text-center'>🤝</div>
                                        <h3 className='font-bold text-green-800 mb-3 text-center'>सामुदायिक सहयोग</h3>
                                        <p className='text-green-700 text-center'>
                                            स्थानीय कारीगरों और शिल्पकारों को सशक्त बनाना
                                        </p>
                                    </div>

                                    <div className='bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200'>
                                        <div className='text-3xl mb-4 text-center'>🎨</div>
                                        <h3 className='font-bold text-purple-800 mb-3 text-center'>परंपरा संरक्षण</h3>
                                        <p className='text-purple-700 text-center'>
                                            भारतीय कला और शिल्प परंपराओं को भविष्य के लिए संरक्षित करना
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Our Team */}
                    {activeSection === 'team' && (
                        <div className='bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg'>
                            <h2 className='text-3xl font-bold text-emerald-800 mb-8 flex items-center space-x-3'>
                                <span>👥</span>
                                <span>हमारे संस्थापक</span>
                            </h2>
                            
                            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                                {founders.map((founder) => (
                                    <div key={founder.id} className='group bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105'>
                                        <div className='text-center mb-6'>
                                            <div className='w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg'>
                                                {founder.name.charAt(0)}
                                            </div>
                                            <h3 className='text-xl font-bold text-emerald-800 mb-1'>{founder.name}</h3>
                                            <p className='text-emerald-600 font-medium mb-2'>{founder.role}</p>
                                            <div className='flex justify-center space-x-3'>
                                                <a href={founder.linkedin} className='text-blue-600 hover:text-blue-700'>
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                                    </svg>
                                                </a>
                                                <a href={founder.twitter} className='text-blue-400 hover:text-blue-500'>
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                        
                                        <p className='text-emerald-700 mb-4 text-center'>{founder.description}</p>
                                        
                                        <div className='space-y-3'>
                                            <div className='bg-white rounded-lg p-3 border border-emerald-200'>
                                                <h4 className='font-semibold text-emerald-800 text-sm mb-1'>शैक्षणिक पृष्ठभूमि:</h4>
                                                <p className='text-emerald-700 text-sm'>{founder.background}</p>
                                            </div>
                                            
                                            <div className='bg-white rounded-lg p-3 border border-emerald-200'>
                                                <h4 className='font-semibold text-emerald-800 text-sm mb-2'>उपलब्धियां:</h4>
                                                <div className='space-y-1'>
                                                    {founder.achievements.map((achievement, index) => (
                                                        <div key={index} className='flex items-center space-x-2'>
                                                            <span className='text-yellow-500'>🏆</span>
                                                            <span className='text-emerald-700 text-sm'>{achievement}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Our Values */}
                    {activeSection === 'values' && (
                        <div className='bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg'>
                            <h2 className='text-3xl font-bold text-emerald-800 mb-8 flex items-center space-x-3'>
                                <span>💎</span>
                                <span>हमारे मूल्य</span>
                            </h2>
                            
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                                {values.map((value, index) => (
                                    <div key={index} className='bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200 hover:shadow-lg transition-all duration-300'>
                                        <div className='flex items-start space-x-4'>
                                            <div className='w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg'>
                                                {value.icon}
                                            </div>
                                            <div className='flex-1'>
                                                <h3 className='text-xl font-bold text-emerald-800 mb-3'>{value.title}</h3>
                                                <p className='text-emerald-700 leading-relaxed'>{value.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* CTA Section */}
                <div className='bg-gradient-to-r from-emerald-600 to-green-600 py-16'>
                    <div className='max-w-4xl mx-auto text-center px-6 text-white'>
                        <h3 className='text-3xl font-bold mb-4'>हमारे साथ जुड़ें</h3>
                        <p className='text-xl text-emerald-100 mb-8'>
                            भारतीय परंपरा और आधुनिक तकनीक के इस सफर में हमारे साथ चलें
                        </p>
                        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                            <a href="/markets" className='bg-white text-emerald-600 px-8 py-4 rounded-full font-semibold hover:bg-emerald-50 transition-colors duration-300 transform hover:scale-105'>
                                बाजार खोजें
                            </a>
                            <a href="/contact" className='border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-emerald-600 transition-all duration-300 transform hover:scale-105'>
                                संपर्क करें
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </React.StrictMode>
    );
};

export default About;