import { useParams, useLocation, Link } from 'react-router-dom';

const MenuViewer = () => {
    const { camis } = useParams();
    const { state } = useLocation();
    const { name, address, phone } = state || {};

    return (
        <div className="menu-page-container">
            <div className="menu-header">
                <h2>{name || 'Restaurant Menu'}</h2>
                {address && <p className="menu-subtext">{address}</p>}
                {phone && <p className="menu-subtext">{phone}</p>}
                <Link to={`/menu/${camis}/upload`} state={state} className="menu-upload-link">
                    Upload Menu
                </Link>
            </div>
            <div className="menu-content">
                <p>No menu available yet</p>
            </div>
        </div>
    );
};

export default MenuViewer;
