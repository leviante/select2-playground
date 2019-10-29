//import libraries
import React, { Fragment } from "react";

//import styles
import "./select2.styles.scss";

class Select2Refactor extends React.Component{

    constructor(props){
        super(props);

        this.selectRef = React.createRef();

        this.state = {
            selectFilterValue: "",
            isInputDropdownHidden: true,
            selectedValue: "",
            pageCount: 1

        };
    }

    handleFilterValue = (e) => {
        this.setState({
            selectFilterValue: e.target.value
        })
    };

    toggleInputDropdown = () => {
        this.setState({
            selectFilterValue: "",
            isInputDropdownHidden: !this.state.isInputDropdownHidden,
            pageCount: 1
        })
    };

    handleListSelection = (dataElement) => {
        this.setState({
            selectedValue: dataElement,
            isInputDropdownHidden: !this.state.isInputDropdownHidden
        })
    };

    handleClickOutside = (e) => {

        if (!this.selectRef.current.contains(e.target)) {
            this.setState({
                selectFilterValue: "",
                isInputDropdownHidden: true,
                pageCount: 1
            });
        }

    };

    handleDropdownScroll = (e) => {
        const { scrollTop, clientHeight, scrollHeight } = e.target;

        //check if scroll pos is bottom
        return scrollTop + clientHeight === scrollHeight ?
            this.setState({
                pageCount: this.state.pageCount + 1
            })
            :
            null;
    };

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside)
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside)
    }

    renderSelect(){
        const { data, optionCount } = this.props;
        const { isInputDropdownHidden, selectedValue, pageCount } = this.state;

        //data format is array of objects {id, text}
        //filter out the data first, then show only a fixed amount
        const filteredData = data.filter( ({text}) => text.includes(this.state.selectFilterValue) )
            .filter( (dataObj, index) => index <= pageCount * optionCount);


        return (
            <Fragment>
            <div
                className={`select2-input ${!isInputDropdownHidden ? "active" : "inactive"}`}
                onClick={() => this.toggleInputDropdown()}
            >
                { selectedValue || "Lütfen seçin"}
            </div>
                {
                   !isInputDropdownHidden ?
                       <div
                           onScroll={(e) => this.handleDropdownScroll(e)}
                           className="select2-input-dropdown"
                       >
                           <input
                               className="select2-input-filter"
                               type="text"
                               onChange={(e) => this.handleFilterValue(e)}
                               placeholder="Search..."
                           />
                           <ul className="select2-dropdown-ul">
                               {
                                   filteredData.length !== 0 ? filteredData.map( ({id, text}, index) =>
                                           <li
                                               key={`${id}${index}`}
                                               className="select2-dropdown-li"
                                               onClick={() => this.handleListSelection(text)}
                                           >
                                               {text}
                                           </li>
                                       )
                                       :
                                           <li className="select2-dropdown-li">Uygun seçim bulunamadı</li>
                               }
                           </ul>
                       </div>
                       :
                       null
                }
            </Fragment>
        );

    }

    renderSelectTag(){

    }

    mainRenderRouter(){
        const { type } = this.props;

        switch(type){
            case "select":
                return this.renderSelect();
            case "select-tag":
                return this.renderSelectTag();
            default:
                return;
        }
    }

    render(){

        return (
            <div ref={this.selectRef} className="select2-outer-container">
                {this.mainRenderRouter()}
            </div>
        );
    }
}

export default Select2Refactor;