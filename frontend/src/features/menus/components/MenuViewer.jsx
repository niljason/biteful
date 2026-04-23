import { useParams, useLocation, Link } from "react-router-dom";
import { drogonClient } from "../../../api/client.js";
import { useState } from "react";

const MenuViewer = () => {
    const { camis } = useParams();
    const { state } = useLocation();
    const { name, address, phone } = state || {};
    const [menus, setMenus] = useState(null);
    let isLoading = false;

    const getMenus = async () => {
        // submit new items with the new menu
        const getMenusResp = await drogonClient("foodItems/" + camis);
        console.log("getMenusResp");
        console.log(getMenusResp);
        setMenus(getMenusResp);
    };

    if (menus === null) {
        getMenus();
        isLoading = true;
    }

    return (
        <div>
            <div>
                <h2>{name || "Restaurant Menu"}</h2>
                {address && <p>{address}</p>}
                {phone && <p>{phone}</p>}
                <Link to={`/${camis}/menu/upload`} state={state}>
                    Upload Menu
                </Link>
            </div>
            <div>
                {isLoading ? <p>Loading...</p> : <p>Loading done (wip)</p>}
            </div>
        </div>
    );
};

export default MenuViewer;
