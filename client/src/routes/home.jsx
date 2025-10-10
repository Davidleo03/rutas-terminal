import HomePage from '../pages/Home/HomePage'
import RoutesPage from '../pages/Home/RoutesPage'
import AvailableRoutes from '../pages/Home/AvailableRoutes'


const homeRoutes = [
    {
        index: true,
        element: <HomePage />,
    },
    {
        path: "/rutas",
        element: <RoutesPage />,
        children: [
            {
                path: "disponibles",
                element: <AvailableRoutes />
            }
        ]
    }
]


export default homeRoutes