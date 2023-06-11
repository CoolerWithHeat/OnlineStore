import { Sidebar, Menu, MenuItem, useProSidebar } from 'react-pro-sidebar';
import {SidebarButton} from './components'

function AdvancedSideBar() {

const { collapseSidebar } = useProSidebar();

return (
    <div style={{ display: 'flex', height: '100%' }}>
    <Sidebar>
        <Menu>
        </Menu>
    </Sidebar>
    <main>
        <button onClick={() => collapseSidebar()}>Collapse</button>
    </main>
    </div>
);
}

export default AdvancedSideBar;