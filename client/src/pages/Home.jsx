import Navbar from "../components/Navbar";
import fondo from "../assets/fondo.webp";


const Home = () => {

    
    return (
        <>
            <Navbar />
            <section
                className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
                style={{ backgroundImage: `url(${fondo})` }}
            >
                <div className="text-center bg-white bg-opacity-20 animate-slide-in-right size-full p-10 rounded-2xl shadow-2xl max-w-2xl mx-auto flex flex-col items-center animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-6 drop-shadow-lg">Rutas y Horarios Terminal San Juan de los Morros</h1>
                    <p className="text-lg md:text-xl text-gray-800 mb-4 font-medium">
                        Encuentra información actualizada sobre horarios, paradas, recorridos y terminales para planificar tu viaje de manera rápida y segura.
                    </p>
                    
                    <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition duration-300">Ver rutas</button>
                        <button className="bg-white hover:bg-gray-100 text-blue-700 border border-blue-600 px-6 py-3 rounded-lg font-semibold shadow-md transition duration-300">Contactar soporte</button>
                    </div>
                </div>
            </section>
        </>
    )
};

export default Home;