export function Card(title, value) {

    return `
        <section class="card">
            <span>${title}</span>
            <h2>${value}</h2>
        </section>
    `;
}