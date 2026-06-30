export function Header(user){
    const hour = new Date().getHours();
    let greeting = "Boa noite";

    if(hour < 12){
        greeting = "Bom dia";
    }

    else if(hour < 18){
        greeting = "Boa tarde";
    }

    return `
        <header class="header">
            <div>
                <small>
                    ${greeting}
                </small>
                <h2>
                    ${user.displayName}
                </h2>
            </div>

            <img
                class="avatar"
                src="${user.photoURL}"
                alt="Foto"
            >
        </header>
    `;
}