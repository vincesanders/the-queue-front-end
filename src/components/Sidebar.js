import React, { useState, useRef } from 'react';
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faChevronDown, faSearch } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components';

export default () => {
    const filterDiv = useRef(null);
    const statusDiv = useRef(null);
    const sortDiv = useRef(null);
    const allTicketsBtn = useRef(null);
    const myTicketsBtn = useRef(null);
    const filterTicketsBtn = useRef(null);
    const sortTicketsBtn = useRef(null);
    const [isFilterDivCollapsed, setIsFilterDivCollapsed] = useState(true);
    const [isStatusDivCollapsed, setIsStatusDivCollapsed] = useState(true);
    const [isSortDivCollapsed, setIsSortDivCollapsed] = useState(true);
    const catgories = [
        'HTML', 'CSS', 'JavaScipt', 'React', 'Redux', 'Git', 'Node', 'Testing', 'Python', 'Java', 'SQL'
    ];
    const buttons = [allTicketsBtn, myTicketsBtn, filterTicketsBtn, sortTicketsBtn];
    const collapsibleDivs = [filterDiv, statusDiv, sortDiv];
    const setIsCollapsedFunctions = [setIsFilterDivCollapsed, setIsSortDivCollapsed, setIsStatusDivCollapsed];

    const populateCategories = () => {
        return catgories.map(category => {
            return <option key={category} value={category}>{category}</option>;
        });
    }

    const handleButtonClick = (element, button) => {
        if (element) {
            collapseDiv(element);
        }
        if (button) {
            button.current.classList.add('selected');
            removeSelectedClass(button);
            if (button === allTicketsBtn || button === myTicketsBtn) {
                collapseAllDivs();
            }
        }
    }

    const removeSelectedClass = button => {
        buttons.forEach(btn => {
            if (btn.current.classList.contains('selected') && btn !== button) {
                btn.current.classList.remove('selected');
            }
        })
    }

    //toggles display of passed in element
    const collapseDiv = element => {
        //toggle display
        if (!element.current.style) {
            element.current.style = 'display: none;';
        } else if (element.current.style.display !== 'none') {
            element.current.style = 'display: none;';
            switch (element) {
                case filterDiv:
                    setIsFilterDivCollapsed(true);
                    break;
                case statusDiv:
                    setIsStatusDivCollapsed(true);
                    break;
                case sortDiv:
                    setIsSortDivCollapsed(true);
                    break;
                default:
                    break;
            }
        } else {
            element.current.style = 'display: flex;';
            switch (element) {
                case filterDiv:
                    setIsFilterDivCollapsed(false);
                    break;
                case statusDiv:
                    setIsStatusDivCollapsed(false);
                    break;
                case sortDiv:
                    setIsSortDivCollapsed(false);
                    break;
                default:
                    break;
            }
        }
        //Ensure other collapsibles collapse
        if (element === filterDiv) {
            if (sortDiv.current.style.display !== 'none') {
                sortDiv.current.style = 'display: none;';
                setIsSortDivCollapsed(true);
            }
        } else if (element === sortDiv) {
            if (statusDiv.current.style.display !== 'none') {
                statusDiv.current.style = 'display: none;';
                setIsStatusDivCollapsed(true);
            }
            if (filterDiv.current.style.display !== 'none') {
                filterDiv.current.style = 'display: none;';
                setIsFilterDivCollapsed(true);
            }
        }
    }

    const collapseAllDivs = () => {
        collapsibleDivs.forEach(div => {
            if (div.current.style.display !== 'none') {
                div.current.style.display = 'none';
            }
        });
        setIsCollapsedFunctions.forEach(setFunc => {
            setFunc(true);
        })
    }

    const displayChevron = (boolean) => {
        if (boolean) {
            return <FontAwesomeIcon icon={faChevronRight} />;
        } else {
            return <FontAwesomeIcon icon={faChevronDown} />;
        }
    }

    return (
        <Container>
            <NavLink to='/protected' >The Queue</NavLink>
            <button className='all-tickets-btn selected' ref={allTicketsBtn} onClick={() => handleButtonClick(undefined, allTicketsBtn)} >All Tickets</button>
            <button className='my-tickets-btn' ref={myTicketsBtn} onClick={() => handleButtonClick(undefined, myTicketsBtn)} >My Tickets</button>
            <button onClick={() => handleButtonClick(filterDiv, filterTicketsBtn)} ref={filterTicketsBtn} >
                {displayChevron(isFilterDivCollapsed)} Filter Tickets
            </button>
            <div ref={filterDiv} style={{display: 'none'}} >
                <button onClick={() => handleButtonClick(statusDiv)} >
                    {displayChevron(isStatusDivCollapsed)} Status
                </button>
                <div ref={statusDiv} style={{display: 'none'}} >
                    <button>Open</button>
                    <button>Closed</button>
                </div>
                <select name='category' defaultValue='category'>
                    <option disabled value='category' >Category</option>
                    {populateCategories()}
                </select>
            </div>
            <button onClick={() => handleButtonClick(sortDiv, sortTicketsBtn)} ref={sortTicketsBtn} >
                {displayChevron(isSortDivCollapsed)} Sort Tickets
            </button>
            <div ref={sortDiv} style={{display: 'none'}} >
                <button>Newest</button>
                <button>Oldest</button>
            </div>
            <form>
                <div>
                    <input type="text" placeholder="Search.." name="search" />
                    <button type="submit"><FontAwesomeIcon icon={faSearch} /></button>
                </div>
                
                <select name='search-option' defaultValue='search-by'>
                    <option disabled value='search-by' >Search by...</option>
                    <option value='title'>Title</option>
                    <option value='description'>Description</option>
                </select>
            </form>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    height: 100%;
    width: 20%;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    overflow: hidden;
    background: #FFF;
    padding-top: 30px;
    .selected {
        background-color: rgba(71, 200, 232, 0.1);
        border-left: 8px solid rgba(71, 200, 232, 1);
        padding-left: 30px;
    }
    a {
        padding-left: 30px;
        color: black;
        font-size: 2rem;
        margin-bottom: 20px;
        text-decoration: none;
    }
    button {
        text-align: left;
        width: 100%;
        padding: 20px 0 20px 38px;
        font-size: 1.2rem;
        background: transparent;
        border: none;
        cursor: pointer;
        &:focus {
            outline: none;
        }
    }
    .all-tickets-btn, .my-tickets-btn {
        font-size: 1.6rem;
    }
    div {
        width: 100%;
        margin-top: -15px;
        margin-left: 10px;
        font-size: 1.2rem;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        button:nth-child(1) {
            margin-top: 10px;
        }
        button {
            /* margin: 5px 0; */
            font-size: 1.1rem;
            padding-top: 10px;
            padding-bottom: 10px;
        }
        select {
            margin-left: 38px;
            width: 67%;
            outline: none;
            font-size: 1.1rem;
        }
        div {
            margin-top: 0;
            button:nth-child(1) {
                margin-top: 0;
                padding-top: 0;
            }
            button {
                padding-top: 10px;
                padding-bottom: 10px;
                font-size: 1rem;
            }
        }
    }
    form {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding-left: 38px;
        select {
            width: 100%;
            margin-top: 0;
            font-size: 1rem;
        }
        div {
            display: flex;
            flex-direction: row;
            margin-top: 0;
            margin-left: 0;
            margin-bottom: -2px;
            align-items: center;
            input {
                width: 100%;
                margin-right: -32px;
                font-size: 1rem;
            }
            button {
                width: 32px;
                text-align: center;
                margin: 0;
                padding: 0;
                color: lightgray;
                vertical-align: middle;
            }
        }
    }
`