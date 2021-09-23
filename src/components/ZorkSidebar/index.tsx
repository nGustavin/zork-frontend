import { useUser } from "@services/User/useUser";
import {
  HTMLAttributes,
  ReactElement,
} from "hoist-non-react-statics/node_modules/@types/react";
import { useRouter } from "next/router";
import {
  AiOutlineHome,
  AiOutlineInfoCircle,
  AiOutlineLogout,
  AiOutlineTransaction,
  AiOutlineUser,
} from "react-icons/ai";
import style from "./style.module.scss";

interface IZorkSidebarButton {
  text: string;
  icon: ReactElement;
  textBubble?: string;
  selected?: boolean;
}

const ZorkSidebarButton: React.FC<
  IZorkSidebarButton & HTMLAttributes<HTMLButtonElement>
> = ({
  text,
  icon,
  selected = false,
  textBubble = "",
  ...props
}: IZorkSidebarButton & HTMLAttributes<HTMLButtonElement>) => {
  return (
    <button {...props} className={style.zorkSidebarButton}>
      <div className={selected ? style.selected : undefined} />
      {icon}
      <p>{text}</p>
      {textBubble != "" ? <label>{textBubble}</label> : <></>}
    </button>
  );
};

interface IZorkSidebarLogoutButton {}
const ZorkSidebarLogoutButton: React.FC<IZorkSidebarLogoutButton> = () => {
  return (
    <button className={style.zorkSidebarLogoutButton}>
      {<AiOutlineLogout size="36px" />}
    </button>
  );
};

const ZorkSidebar: React.FC = () => {
  const router = useRouter();

  return (
    <div className={style.zorkSidebar}>
      <header>
        <h1>Zork</h1>
      </header>

      <main>
        <ZorkSidebarButton
          icon={<AiOutlineHome size="32px" />}
          text="Home"
          onClick={() => {
            router.push("/dashboard");
          }}
        />
        <ZorkSidebarButton
          icon={<AiOutlineUser size="32px" />}
          text="Users"
          onClick={() => {
            router.push("/users");
          }}
        />
        <ZorkSidebarButton
          selected
          icon={<AiOutlineTransaction size="32px" />}
          text="Transactions"
          onClick={() => {
            router.push("/transactions");
          }}
        />
        <ZorkSidebarButton
          icon={<AiOutlineInfoCircle size="32px" />}
          text="Requests"
          textBubble="4"
          onClick={() => {
            router.push("/requests");
          }}
        />
      </main>

      <footer>
        <ZorkSidebarLogoutButton />
      </footer>
    </div>
  );
};

export default ZorkSidebar;
