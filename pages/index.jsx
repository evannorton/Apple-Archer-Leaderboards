import Head from "next/head"

export default ({ scores }) => {
    const getScoreDate = (scoredAt) => {
        const date = new Date(scoredAt);
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    };
    return (
        <>
            <Head>
                <title>Apple Archer Leaderboards</title>
            </Head>
            <div className="nes-table-responsive">
                <h1 style={{ color: "white" }} className="nes-text">Apple Archer Leaderboards</h1>
                <table style={{
                    marginLeft: "auto",
                    marginRight: "auto"
                }} className="nes-table is-bordered is-centered is-dark">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Score</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scores.map(({ name, score, scoredAt }, key) =>
                            <tr key={key}>
                                <td>{key + 1}</td>
                                <td>{name}</td>
                                <td>{score}</td>
                                <td>{getScoreDate(scoredAt)}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export const getServerSideProps = async () => ({
    props: {
        scores: (await require("../sequelize").models.scores.findAll()).map(({ dataValues }) => ({
            name: dataValues.name,
            score: dataValues.score,
            scoredAt: dataValues.scoredAt.toString()
        })).sort((a, b) => b.score - a.score)
    }
});