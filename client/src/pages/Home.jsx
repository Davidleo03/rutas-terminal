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
            <section>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">¿Por qué elegirnos?</h2>
                        <p className="text-lg text-gray-600">Ofrecemos la información más precisa y actualizada para que tu viaje sea seguro y eficiente.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md transform hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition duration-300 ease-out">
                            <h3 className="text-xl font-semibold text-blue-600 mb-4">Información Actualizada</h3>
                            <p className="text-gray-600">Mantenemos nuestros datos al día para que siempre tengas la información correcta sobre rutas y horarios.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md transform hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition duration-300 ease-out">
                            <h3 className="text-xl font-semibold text-blue-600 mb-4">Fácil de Usar</h3>
                            <p className="text-gray-600">Nuestra plataforma es intuitiva y fácil de navegar, permitiéndote encontrar lo que necesitas rápidamente.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md transform hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition duration-300 ease-out">
                            <h3 className="text-xl font-semibold text-blue-600 mb-4">Soporte al Cliente</h3>
                            <p className="text-gray-600">Nuestro equipo de soporte está disponible para ayudarte con cualquier consulta o problema que puedas tener.</p>
                        </div>
                    </div>

                </div>
            </section>
            <footer className="bg-gray-800 text-white py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-sm">&copy; 2024 Rutas Terminal San Juan de los Morros. Todos los derechos reservados.</p>
                </div>
            </footer>   
        </>
    )
};

export default Home;