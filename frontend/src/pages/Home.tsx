import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { userId } = useAuth(); // Recuperamos el userId del contexto

  return (
    <div className="mt-5">
      <h1>Protected Data</h1>
      <p>
        Bienvenido a la página protegida. Tu identificador de usuario es:{" "}
        <strong>{userId}</strong>
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex natus
        quisquam culpa, deleniti maxime unde tenetur, cum, repellat eius autem
        enim! Deserunt cum nam quaerat voluptas? Nostrum amet autem odio!
      </p>
      {/* Puedes añadir más contenido aquí */}
    </div>
  );
};

export default Home;
