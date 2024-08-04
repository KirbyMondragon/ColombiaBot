const Make = "https://hook.us1.make.com/vp6lv73bmg5xo4tsrmr4yz4k0voug997"

const SendMail = async (Name:string ,Number:string, Opcion:string) => {
    try {
        const payload = {
            Name: Name,
            Number:Number,
            Opcion: Opcion,
        };
        
        const response = await fetch(Make, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

    } catch (err) {
        console.error('Error:', err);
    }
};

export default SendMail;