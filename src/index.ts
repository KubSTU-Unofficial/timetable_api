import bootstrap from "./shared/bootstrap.js";
import { createServer } from "./app/server.js";

const PORT = process.env.PORT ?? 3000;

async function main() {
    await bootstrap();

    const app = createServer();

    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}

main();
