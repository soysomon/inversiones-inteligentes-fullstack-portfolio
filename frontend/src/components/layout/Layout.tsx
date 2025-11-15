import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  onNavigateToHome?: () => void;
  onNavigateToProperties?: () => void;
  onNavigateToAbout?: () => void;
  currentView?: string;
}

const Layout = ({ 
  children, 
  onNavigateToHome, 
  onNavigateToProperties, 
  onNavigateToAbout,
  currentView 
}: LayoutProps) => {
  return (
    <div className="min-h-screen bg-white">
      <Header 
        onNavigateToHome={onNavigateToHome}
        onNavigateToProperties={onNavigateToProperties}
        onNavigateToAbout={onNavigateToAbout}
        currentView={currentView}
      />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;