import './App.css';
import Sala from './components/Sala';
import Cozinha from './components/Cozinha';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
import { TabPanel, TabView } from 'primereact/tabview';
import Quarto from './components/Quarto/Quarto';



const App: React.FC = () => {

  const headerWithAvatar = (options: any) => {
    const className = `${options.className} justify-content-space-between`;

    return (
      <div className={className}>
        <div className="flex align-items-center gap-2">
          <Avatar image="img/casa-nova.png" size="large" shape="square" />
          <span className="font-bold text-4xl">Smart Home</span>
        </div>
      </div>
    );
  }

  const footer = () => {
    return (
      <div className="flex justify-content-center">
        <span className="text-center">© 2024 - Smart Home - Murilo Costa Bittencourt</span>
      </div>
    );
  }

  return (
    <div className="p-3">
      <Panel headerTemplate={headerWithAvatar} footerTemplate={footer}>

        <TabView>
          <TabPanel header="Sala" >
            <Sala />
          </TabPanel>
          <TabPanel header="Cozinha">
            <Cozinha />
          </TabPanel>
          <TabPanel header="Quarto">
            <Quarto />
          </TabPanel>
        </TabView>
      </Panel>
    </div>
  );
}

export default App;
