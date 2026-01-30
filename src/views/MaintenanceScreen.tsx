import Kubomanu from "../assets/icons/Universal/Kubomanu.png";

export default function MaintenanceScreen(): JSX.Element {
  return (
    <div className="min-h-screen bg-white dark:bg-[#151B23] flex items-center justify-center px-4">
      <div className="text-center">
        <img
          src={Kubomanu}
          alt="Manutenção"
          className="
            mx-auto
            w-[500px]
            md:w-[650px]
            lg:w-[750px]
            -mb-14
          "
        />

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white leading-none mb-0">
          Estamos fazendo
          <br />
          melhorias no sistema
        </h1>
      </div>
    </div>
  );
}