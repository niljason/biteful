import { useState } from "react";

const Restaurant = () => {
    const [result, setResult] = useState(null);
    const onSubmit = async (e) => {
        e.preventDefault(); // prevents form default submission behavior
        const headers = {
            "Content-Type": "multipart/form-data",
        };

        const config = {
            mode: "cors", // Explicitly set CORS mode
            headers,
            method: "POST",
        };
        try {
            const resp = await fetch(
                import.meta.env.VITE_API_BASE_URL + "ocr/",
                config,
            );
            if (resp.ok) {
                console.log("ok");
                setResult(await resp.json());
            }
            if (!resp.ok) {
                const errorData = await resp.json().catch(() => ({}));
                throw new Error(
                    errorData.error || `Server returned ${resp.status}`,
                );
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    };

    if (result) {
        console.log("result is");
        console.log(result);
    }
    return (
        <>
            <p>
                The only point of this page is to ping /ocr and get a response
                back
            </p>
            <form action="POST" onSubmit={onSubmit}>
                <button type="submit">Submit</button>
            </form>
            <div></div>
        </>
    );
};

export default Restaurant;
