export default function ResultCard({ result }: any) {
    const getColor = () => {
        if (result.code === 2) return "#4CAF50"; // Vert
        if (result.code === 1) return "#FFC107"; // Jaune
        return "#F44336"; // Rouge
    };

    return (
        <div
            style={{
                marginTop: 30,
                padding: 20,
                borderRadius: 10,
                backgroundColor: getColor(),
                color: "white",
                width: 300
            }}
        >
            <h2 style={{ margin: 0 }}>Résultat :</h2>
            <p style={{ fontSize: 20, fontWeight: "bold" }}>
                {result.qualite_predite}
            </p>
            <p>Code modèle : {result.code}</p>
        </div>
    );
}
