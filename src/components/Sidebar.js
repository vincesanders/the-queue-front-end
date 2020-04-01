import React, { useState, useRef } from 'react';
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    getAllTickets, 
    getMyTickets, 
    getOpenTickets, 
    getClosedTickets, 
    getTicketsFilteredByCategory, 
    searchTickets,
    sortTicketsNewest,
    sortTicketsOldest
    } from '../state/actions/actions';
import { faChevronRight, faChevronDown, faSearch } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components';
import Profile from './Profile';

export default () => {
    const dispatch = useDispatch();
    const filterDiv = useRef(null);
    const statusDiv = useRef(null);
    const sortDiv = useRef(null);
    const allTicketsBtn = useRef(null);
    const myTicketsBtn = useRef(null);
    const filterTicketsBtn = useRef(null);
    const sortTicketsBtn = useRef(null);
    const openTicketsBtn = useRef(null);
    const closedTicketsBtn = useRef(null);
    const newestTicketsBtn = useRef(null);
    const oldestTicketsBtn = useRef(null);
    const searchBySelect = useRef(null);
    const [isFilterDivCollapsed, setIsFilterDivCollapsed] = useState(true);
    const [isStatusDivCollapsed, setIsStatusDivCollapsed] = useState(true);
    const [isSortDivCollapsed, setIsSortDivCollapsed] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const userId = useSelector(state => {
        if (state.userId > 0) {
            return state.userId;
        } else if (localStorage.getItem('user')) {
            return localStorage.getItem('user');
        } else {
            return 0;
        }
    });
    const catgories = [
        'HTML', 'CSS', 'JavaScript', 'React', 'Redux', 'Git', 'Node', 'Testing', 'Python', 'Java', 'SQL'
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
            if (button !== newestTicketsBtn && button !== oldestTicketsBtn && button !== openTicketsBtn && button !== closedTicketsBtn) {
                button.current.classList.add('selected');
                removeSelectedClass(button);
                if (button === allTicketsBtn || button === myTicketsBtn) {
                    collapseAllDivs();
                }
            }
            //dispatches will go here
            switch (button) {
                case allTicketsBtn:
                    dispatch(getAllTickets());
                    break;
                case myTicketsBtn:
                    dispatch(getMyTickets(userId));
                    break;
                case openTicketsBtn:
                    dispatch(getOpenTickets());
                    break;
                case closedTicketsBtn:
                    dispatch(getClosedTickets());
                    break;
                case newestTicketsBtn:
                    dispatch(sortTicketsNewest());
                    break;
                case oldestTicketsBtn:
                    dispatch(sortTicketsOldest());
                    break;
                default:
                    break;
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

    const handleCategoryChange = e => {
        //dispatch
        dispatch(getTicketsFilteredByCategory(e.target.value));
        e.target.value = 'category'
    }

    const handleSearchInputChange = e => {
        setSearchValue(e.target.value);
    }

    const handleSearchChange = e => {
        if (searchValue.trim() !== '') {
            dispatch(searchTickets(searchValue, e.target.value));
        }
    }

    const handleSearchSubmit = e => {
        e.preventDefault();
        //if something has been typed in the search input &
        //if a category has been chosen
        if (searchValue.trim() !== '' && 
        (searchBySelect.current.value === 'title' || searchBySelect.current.value === 'description')) {
            dispatch(searchTickets(searchValue, searchBySelect.current.value));
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
                    <button ref={openTicketsBtn} onClick={() => handleButtonClick(undefined, openTicketsBtn)}>Open</button>
                    <button ref={closedTicketsBtn} onClick={() => handleButtonClick(undefined, closedTicketsBtn)}>Closed</button>
                </div>
                <select onChange={handleCategoryChange} name='category' defaultValue='category'>
                    <option disabled value='category' >Category</option>
                    {populateCategories()}
                </select>
            </div>
            <button onClick={() => handleButtonClick(sortDiv, sortTicketsBtn)} ref={sortTicketsBtn} >
                {displayChevron(isSortDivCollapsed)} Sort Tickets
            </button>
            <div ref={sortDiv} style={{display: 'none'}} >
                <button ref={newestTicketsBtn} onClick={() => handleButtonClick(undefined, newestTicketsBtn)}>Newest</button>
                <button ref={oldestTicketsBtn} onClick={() => handleButtonClick(undefined, oldestTicketsBtn)}>Oldest</button>
            </div>
            <form onSubmit={handleSearchSubmit}>
                <div>
                    <input type="text" placeholder="Search.." name="search" value={searchValue} onChange={handleSearchInputChange} />
                    <button type="submit">
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                </div>
                
                <select ref={searchBySelect} onChange={handleSearchChange} name='search-option' defaultValue='search-by'>
                    <option disabled value='search-by' >Search by...</option>
                    <option value='title'>Title</option>
                    <option value='description'>Description</option>
                </select>
            </form>
            <Profile />
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    height: 100%;
    min-height: 580px;
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
            background: #f7f7f7;
            padding: 6px;
            border-radius: 8px;
            border: 2px solid transparent;
            &:focus {
                border-color: #e627ff;
                outline: none;
            }
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
        width: 82%;
        select {
            width: 100%;
            margin-top: 0;
            font-size: 1rem;
            background: #f7f7f7;
            padding: 6px;
            border-radius: 8px;
            border: 2px solid transparent;
            &:focus {
                border-color: #e627ff;
                outline: none;
            }
        }
        div {
            display: flex;
            flex-direction: row;
            margin-top: 20px;
            margin-left: 0;
            margin-bottom: -2px;
            align-items: center;
            input {
                width: 100%;
                margin-right: -32px;
                font-size: 1rem;
                padding: 6px;
                border-radius: 8px;
                border: 4px solid rgba(255, 255, 255, 0.3);
                background-color: #e0e0e0;
                &:focus {
                    outline: none;
                    border: 4px solid #c717c4;
                }
            }
            button {
                width: 32px;
                text-align: center;
                margin: 0;
                padding: 0;
                vertical-align: middle;
                border: none;
                outline: none;
                background-color: transparent;
                color: rgba(199, 23, 196, 0.4);
                vertical-align: middle;
                font-size: 20px;
            }
        }
    }
    @media screen and (max-width: 1200px) {
        a {
            font-size: 1.6rem;
            margin-bottom: 8px;
            padding-left: 20px;
        }
        .selected {
            padding-left: 12px;
        }
        .all-tickets-btn, .my-tickets-btn {
            font-size: 1.2rem;
        }
        button {
            font-size: 1rem;
            padding-left: 20px;
        }
        form {
            width: 90%;
            padding-left: 20px;
            div {
                margin-top: 8px;
            }
        }
        .select, input, form select, div select, div button, div div button, form div input {
            font-size: 0.8rem;
        }
        div select {
            margin-left: 20px;
        }
    }
    @media screen and (max-width: 800px) {
        a {
            font-size: 1.2rem;
            margin-bottom: 6px;
            padding-left: 10px;
        }
        .selected {
            padding-left: 2px;
        }
        .all-tickets-btn, .my-tickets-btn {
            font-size: 0.8rem;
        }
        button {
            font-size: 0.8rem;
            padding-left: 10px;
        }
        form {
            width: 92%;
            padding-left: 10px;
            div {
                margin-top: 6px;
            }
        }
        .select, input, form select, div select, div button, div div button, form div input {
            font-size: 0.8rem;
        }
        div select {
            margin-left: 10px;
            width: 80%;
        }
    }
    @media screen and (max-width: 650px) {
        /* turns to a topbar. */
        right: 0;
        width: 100%;
        height: auto;
        min-height: auto;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        padding: 0;
        a {
            width: 100%;
            margin: 10px auto 20px auto;
            font-size: 1.6rem;
        }
        button, form {
            display: none;
        }
        .selected {
            border-left: none;
            border-bottom: 8px solid rgba(71, 200, 232, 1);
        }
        .all-tickets-btn, .my-tickets-btn {
            display: inline-block;
            width: 50%;
            text-align: center;
            font-size: 1.2rem;
        }
    }
`