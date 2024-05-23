import { Button, Result } from 'antd';
import 'react-reflex/styles.css';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
/**
 * Renders the main component of the application.
 * 
 * @returns {JSX.Element} The rendered component.
 */
interface Props {
}
function NotFound(props: Props) {
  const navigate = useNavigate()
  return (
    <Result
      status="404"
      title="404"
      subTitle="Такой страницы нет"
      extra={<Button type="primary" onClick={() => navigate('/')}>На главную</Button>}
    />
  )
}

export default observer(NotFound);
