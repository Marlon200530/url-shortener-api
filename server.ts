import app from "./src/app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, async function () {
    console.log(`Server is running at PORT: ${PORT}`);
});
