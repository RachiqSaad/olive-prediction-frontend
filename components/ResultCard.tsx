export default function ResultCard({ result }: any) {
    const getColor = (code: number) => {
        if (code === 3) return "#4CAF50"; // Vert = Excellente qualité
        if (code === 1) return "#FFC107"; // Jaune = Bonne qualité
        return "#F44336"; // Rouge = Mauvaise qualité
    };

    return (
        <div style={{ marginTop: 20 }}>
            {result.predictions.map((r: any, i: number) => (
                <div
                    key={i}
                    style={{
                        marginBottom: 10,
                        padding: 15,
                        borderRadius: 8,
                        backgroundColor: getColor(r.code),
                        color: "white",
                        fontWeight: "bold"
                    }}
                >
                    <p>Résultat : {r.qualite_predite}</p>
                    <p>Code modèle : {r.code}</p>
                </div>
            ))}
        </div>
    );
}
