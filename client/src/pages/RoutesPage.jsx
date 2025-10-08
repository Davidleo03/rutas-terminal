import { HomeLinks } from "../utils/Links";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const RoutesPage = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar links={HomeLinks} />
            
            <main className="flex-grow p-4">
                <p>Aquí puedes ver todas las rutas disponibles.</p>
                {/* Aquí iría la lógica para mostrar las rutas */}
            </main>
            <Footer />
        </div>
    );
};

export default RoutesPage;