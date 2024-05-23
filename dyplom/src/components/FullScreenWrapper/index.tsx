import { Navigate, Outlet, Route } from "react-router-dom";
import { observer } from "mobx-react-lite";
import authStore from "../../store/auth.store";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { FloatButton } from "antd";
import styles from "./styles.module.css";
import { FullscreenExitOutlined, FullscreenOutlined } from "@ant-design/icons";

interface Props {
  children: React.ReactNode;
}
const FullScreenWrapper = (props: Props) => {
  const handle = useFullScreenHandle();

  return <FullScreen className={styles['container']} handle={handle} >
    <div style={{
      height: '100%',
      width: '100%',
      backgroundColor: 'white',
      padding: handle.active ? 12 : 0,
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      overflow: 'auto'
    }}>
      {!handle.active ?
        <FloatButton style={{top:'15px'}} onClick={handle.enter}  icon={<FullscreenOutlined />} />
        : <FloatButton onClick={handle.exit} icon={<FullscreenExitOutlined />} />
      }
      {props.children}
    </div>
  </FullScreen>
};

export default FullScreenWrapper;