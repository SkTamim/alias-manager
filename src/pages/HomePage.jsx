// src/pages/HomePage.jsx
import React, { useState } from 'react'; // <-- Added useState

import { useNavigate } from 'react-router-dom';

import {
  AlertModal,
} from '../components/AlertModal'; // <-- NEW: Import AlertModal
import { Logo } from '../components/Logo';
import { useAuth } from '../contexts/AuthContext';

// ... (Icon components remain the same) ...
const ImportIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-indigo-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v10.5A2.25 2.25 0 0118.75 19.5H5.25A2.25 2.25 0 013 17.25z" /></svg> );
const CloudIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-sky-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 13.5a9 9 0 1118 0c0 1.313-.343 2.553-.946 3.654l-1.353 2.165A3.375 3.375 0 0116.5 21h-9a3.375 3.375 0 01-2.201-1.181l-1.354-2.165A8.96 8.96 0 013 13.5z" /></svg> );
const SearchIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-amber-400"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg> );
const GoogleLogo = () => ( <svg className="w-6 h-6" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.971,36.216,44,30.632,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg> );

export default function HomePage() {
    const { currentUser, login } = useAuth();
    const navigate = useNavigate();

    // NEW: State to manage the alert modal
    const [alertProps, setAlertProps] = useState({
        isOpen: false,
        title: '',
        message: '',
    });

    const handleLogin = async () => {
        try {
            await login();
            navigate('/dashboard');
        } catch (error) {
            console.error("Failed to log in", error);
            // UPDATED: Use the custom alert modal instead of the native alert
            setAlertProps({
                isOpen: true,
                title: 'Login Failed',
                message: 'Could not sign in with Google. This may be due to a pop-up blocker or a network issue. Please try again.'
            });
        }
    };

    // ... (ActionButton and FeatureCard components remain the same) ...
    const ActionButton = ({ className = '' }) => ( currentUser ? ( <button onClick={() => navigate('/dashboard')} className={`bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-green-500/40 ${className}`}> Go to Your Dashboard </button> ) : ( <button onClick={handleLogin} className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-purple-500/40 flex items-center gap-3 ${className}`}> <GoogleLogo /> Get Started for Free </button> ) );
    const FeatureCard = ({ icon, title, children }) => ( <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700/50 transform transition-all hover:scale-105 hover:bg-gray-800 hover:shadow-2xl hover:shadow-purple-500/20"> <div className="bg-gray-900 rounded-xl p-4 inline-block mb-6 border border-gray-700"> {icon} </div> <h3 className="text-2xl font-bold mb-3 text-white">{title}</h3> <p className="text-gray-400 leading-relaxed">{children}</p> </div> );

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans">
            {/* NEW: Render the alert modal */}
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
                    <div className="animate-[fadeIn_1.5s_ease-out_1s]">
                        <ActionButton />
                    </div>
                </main>

                <section className="py-24 bg-black/20">
                    <div className="container mx-auto max-w-6xl px-4">
                        <h2 className="text-4xl font-bold text-center mb-16">A Smarter Way to Manage Your CAD Shortcuts</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <FeatureCard icon={<ImportIcon />} title="Smart Import">
                                Intelligently parse your existing alias files. Our tool cleans up messy commands and adds helpful descriptions for known shortcuts.
                            </FeatureCard>
                            <FeatureCard icon={<CloudIcon />} title="Cloud Sync">
                                Your aliases are saved to your private account, always in sync and accessible on any computer, anywhere.
                            </FeatureCard>
                             <FeatureCard icon={<SearchIcon />} title="Instant Search">
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