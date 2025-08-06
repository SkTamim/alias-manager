// src/pages/HomePage.jsx
import React, { useState } from 'react';

import { FcGoogle } from 'react-icons/fc'; // <-- NEW: Import the Google icon
import {
  FiCloud,
  FiSearch,
  FiUploadCloud,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { AlertModal } from '../components/AlertModal';
import { Logo } from '../components/Logo';
import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
    const { currentUser, login } = useAuth();
    const navigate = useNavigate();
    
    const [alertProps, setAlertProps] = useState({
        isOpen: false,
        title: '',
        message: '',
    });

    const handleLogin = async () => {
        try {
            await login();
            navigate('/sets');
        } catch (error) {
            console.error("Failed to log in", error);
            setAlertProps({
                isOpen: true,
                title: 'Login Failed',
                message: 'Could not sign in with Google. This may be due to a pop-up blocker or a network issue. Please try again.'
            });
        }
    };

    const ActionButton = ({ className = '' }) => ( 
        currentUser ? ( 
            <button onClick={() => navigate('/sets')} className={`bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-green-500/40 ${className}`}> 
                Go to Your Dashboard 
            </button> 
        ) : ( 
            <button onClick={handleLogin} className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-purple-500/40 flex items-center gap-3 ${className}`}> 
                {/* UPDATED: Using the imported FcGoogle icon */}
                <FcGoogle className="w-6 h-6" /> 
                Get Started for Free 
            </button> 
        ) 
    );
    
    const FeatureCard = ({ icon, title, children }) => ( 
        <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700/50 transform transition-all hover:scale-105 hover:bg-gray-800 hover:shadow-2xl hover:shadow-purple-500/20"> 
            <div className="bg-gray-900 rounded-xl p-4 inline-block mb-6 border border-gray-700"> {icon} </div> 
            <h3 className="text-2xl font-bold mb-3 text-white">{title}</h3> 
            <p className="text-gray-400 leading-relaxed">{children}</p> 
        </div> 
    );

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans">
            <AlertModal
                isOpen={alertProps.isOpen}
                onClose={() => setAlertProps({ ...alertProps, isOpen: false })}
                title={alertProps.title}
            >
                {alertProps.message}
            </AlertModal>

            <div className="absolute inset-0 z-0 opacity-40" style={{backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(66, 71, 244, 0.3), rgba(17, 24, 39, 0) 50%)'}}></div>
            
            <div className="relative z-10">
                <header className="py-10 px-4 pt-10">
                    <div className="container mx-auto flex justify-between items-center">
                        <Logo /> 
                        <ActionButton className="text-base py-2 px-6" />
                    </div>
                </header>

                <main className="flex flex-col items-center justify-center text-center px-4 pt-24 pb-24">
                    <h2 className="h-23 text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 animate-[fadeInDown_1s_ease-out]">
                        Stop Searching, Start Creating.
                    </h2>
                    <p className="text-lg md:text-xl text-gray-300 max-w-3xl mb-12 animate-[fadeInUp_1s_ease-out_0.5s]">
                        Your personal, cloud-synced command center for Rhino & Matrix aliases. Intelligently import, manage, and export your shortcuts from any device, anytime.
                    </p>
                    <div className="animate-[fadeIn_1.s_ease-out_1s]">
                        <ActionButton />
                    </div>
                </main>

                <section className="py-24 bg-black/20">
                    <div className="container mx-auto max-w-6xl px-4">
                        <h2 className="text-4xl font-bold text-center mb-16">A Smarter Way to Manage Your CAD Shortcuts</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <FeatureCard icon={<FiUploadCloud className="w-8 h-8 text-indigo-400" />} title="Smart Import">
                                Intelligently parse your existing alias files. Our tool cleans up messy commands and adds helpful descriptions for known shortcuts.
                            </FeatureCard>
                            <FeatureCard icon={<FiCloud className="w-8 h-8 text-sky-400" />} title="Cloud Sync">
                                Your aliases are saved to your private account, always in sync and accessible on any computer, anywhere.
                            </FeatureCard>
                            <FeatureCard icon={<FiSearch className="w-8 h-8 text-amber-400" />} title="Instant Search">
                                Never forget a shortcut again. Instantly search your entire list by alias, command, or description.
                            </FeatureCard>
                        </div>
                    </div>
                </section>
                
                <section className="py-24">
                    <div className="container mx-auto max-w-5xl px-4 text-center">
                        <h2 className="text-4xl font-bold text-center mb-16">Get Set Up in Seconds</h2>
                        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
                            <div className="text-center">
                                <div className="text-5xl font-bold text-blue-500 mb-2">1</div>
                                <h3 className="text-xl font-semibold mb-2">Log In</h3>
                                <p className="text-gray-400">Securely sign in with your Google Account.</p>
                            </div>
                            <div className="text-gray-600 text-3xl hidden md:block">→</div>
                             <div className="text-center">
                                <div className="text-5xl font-bold text-purple-500 mb-2">2</div>
                                <h3 className="text-xl font-semibold mb-2">Import Your File</h3>
                                <p className="text-gray-400">Upload your existing alias `.txt` file.</p>
                            </div>
                            <div className="text-gray-600 text-3xl hidden md:block">→</div>
                             <div className="text-center">
                                <div className="text-5xl font-bold text-green-500 mb-2">3</div>
                                <h3 className="text-xl font-semibold mb-2">Manage & Export</h3>
                                <p className="text-gray-400">Search, edit, and export your perfected list.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="text-center py-12 border-t border-gray-800">
                    <p className="text-gray-500">Built to accelerate your design process.</p>
                </footer>
            </div>

            <style jsx global>{`
                @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .animate-fadeInDown { animation: fadeInDown 1s ease-out forwards; }
                .animate-fadeInUp { animation: fadeInUp 1s ease-out forwards; }
                .animate-fadeIn { animation: fadeIn 1.5s ease-out forwards; }
            `}</style>
        </div>
    );
}