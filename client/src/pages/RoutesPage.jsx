import { HomeLinks } from "../utils/Links";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Table from "../components/Table";

const RoutesPage = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar links={HomeLinks} />
            
            <main className="flex-grow p-4">
                <p className="text-stone-900 font-bold">Aquí puedes ver todas las rutas disponibles.</p>
                <Table/>
                
            </main>
            <Footer />
        </div>
    );
};

export default RoutesPage;