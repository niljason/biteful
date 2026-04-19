import { useParams, useLocation, Link } from 'react-router-dom';

const MenuUploader = () => {
    const { camis } = useParams();
    const { state } = useLocation();
    const { name, address, phone } = state || {};

    return (
        <div className="menu-page-container">
            <div className="menu-header">
                <h2>{name || 'Upload Menu'}</h2>
                {address && <p className="menu-subtext">{address}</p>}
                {phone && <p className="menu-subtext">{phone}</p>}
                <Link to={`/menu/${camis}`} state={state} className="menu-back-link">
                    Back to Menu
                </Link>
            </div>
            <div className="menu-upload-area">
                <p>Upload functionality coming soon</p>
            </div>
        </div>
    );
};

export default MenuUploader;
