import Header from './components/Header';
import Hero from './components/Hero';
import Notice from './components/Notice';
import Benefits from './components/Benefits';
import Comments from './components/Comments';
import Install from './components/Install';
import Faq from './components/Faq';
import Footer from './components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Benefits />
        <Comments />
        <Install />
        <Notice />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
