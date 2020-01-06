import { CSSProperties } from 'react';

const mainWrapper: CSSProperties = {
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: '8px 12px',
    borderRadius: '8px',
    boxShadow: '0px 1px 3px rgba(165, 133, 23, 0.5)',
    width: '473px',
    height: '110px',
    flexShrink: 0,
    flexGrow: 0,
};

const mainWrapperMobile: CSSProperties = {
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: '8px 12px',
    borderRadius: '8px',
    boxShadow: '0px 1px 3px rgba(165, 133, 23, 0.5)',
    width: '90%',
    height: '110px',
    flexShrink: 0,
    flexGrow: 0,
};

const img: CSSProperties = {
    margin: '27px',
    marginRight: '37px',
};

const imgMobile: CSSProperties = {
    margin: '5px',
};

const header: CSSProperties = {
    fontWeight: 'bold',
};

const headerMobile: CSSProperties = {
    fontWeight: 'bold',
    fontSize: '12px',
};


const content: CSSProperties = {
    fontSize: '24px',
    color: '#A58517',
};
const contentMobile: CSSProperties = {
    fontSize: '12px',
    color: '#A58517',
};

export const styles = {
    mainWrapper,
    mainWrapperMobile,
    header,
    img,
    imgMobile,
    content,
    contentMobile,
    headerMobile,
};
