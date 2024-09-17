import { useSelector } from "react-redux";
import Image from 'react-bootstrap/Image';
import { Link } from "react-router-dom";
import { memo, useState } from "react";

const BreadcrumbComponent = ({ children }) => {
    const [isHover, setIsHover] = useState(false);
    const moduleName = useSelector(state => state.ui.moduleName);
    const submoduleName = useSelector(state => state.ui.submoduleName);
    const moduleLink = useSelector(state => state.ui.moduleLink);

    return (
        <div style={{ fontSize: '17px' }}
            className={`d-flex align-items-center ${children ? 'justify-content-between' : ''} py-4`}>
            <div>
                <Link to={`/${moduleLink}`}
                    className='inline-block'
                    style={{ color: '#44596e', textDecoration: isHover ? 'underline' : 'none' }}
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                >
                    {moduleName}
                </Link>
                <span>
                    <Image src="/right-arrow.png" width={10} style={{ marginBottom: '2px', marginInline: '10px' }} />
                </span>
                <span className='inline-block'>{submoduleName}</span>
            </div>
            <div className="me-4">
                {children}
            </div>
        </div >
    )
}

export default memo(BreadcrumbComponent);
