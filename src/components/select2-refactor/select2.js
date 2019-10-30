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
            pageCount: 1,
            addedTags: [],
            tagContext: ""
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

        //check if scroll pos is at bottom
        return scrollTop + clientHeight === scrollHeight ?
            this.setState({
                pageCount: this.state.pageCount + 1
            })
            :
            null;
    };

    handleTagInputChange = (e) => {
        this.setState({
            isInputDropdownHidden: false,
            tagContext: e.target.value
        });
    };

    handleTagKeyPress = (e) => {
        const { addedTags, tagContext } = this.state;
        const { createNewTag } = this;

        if(e.key === "Enter") {

            //case 1 - no tags added
            if (addedTags.length === 0) {
                //if it's whitespace, reset
                if(tagContext.trim() === ""){
                    this.setState({
                        isInputDropdownHidden: !this.state.isInputDropdownHidden,
                        tagContext: ""
                    });
                }else {
                    this.setState({
                        isInputDropdownHidden: !this.state.isInputDropdownHidden,
                        addedTags: [
                            createNewTag(tagContext)
                        ],
                        tagContext: ""
                    });
                }
            } else {
                //case 2 - add unique tags only (again w/o whitespace)
                return this.addUniqueTag(tagContext);
            }
        }
    };

    addUniqueTag = (tagText) => {
        const { addedTags } = this.state;
        const { createNewTag } = this;

        const isTagUnique = addedTags.every( ({text}) => text !== tagText && tagText.trim() !== "");
        console.log(isTagUnique);

        if(isTagUnique) {
            this.setState({
                addedTags:[
                    ...addedTags,
                    createNewTag(tagText)
                ],
                tagContext: ""
            });
        }else {
            this.setState({
                tagContext: ""
            });
        }
    };


    createNewTag = (text) => ({
        id: `addedTag${text.substring(-3)}`,
        text
    });

    addTagFromCategory = (e) => {
        this.addUniqueTag(e.target.textContent);
    };

    deleteTag = (e) => {
        const { addedTags } = this.state;
        const { textContent } = e.target.nextElementSibling;

        //filter out the selected tag
        const modifiedTagsArray = addedTags.filter( ({text}) => text !== textContent);

        this.setState({
           addedTags: modifiedTagsArray
        });
    };

    createDropdownContent = () => {
        const { categoryData } = this.props;
        const { addedTags } = this.state;

        const dropdownContent = [...categoryData];

        addedTags.forEach( (tagObj) => {
            const hasText = dropdownContent.some((contentObj) => contentObj.text === tagObj.text);
            if(!hasText){
                return dropdownContent.push(tagObj);
            }
        });

        return dropdownContent;
    };

    componentDidMount() {
        //close dropdown if user clicks outside
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
        const { isInputDropdownHidden, addedTags, tagContext } = this.state;

        const dropdownContent = this.createDropdownContent()
            .filter(({text}) => text.includes(tagContext));


        return (
            <div className={`select2-tag-container ${!isInputDropdownHidden ? "active" : "inactive"}`}>
                <ul className="select2-tag-child-container">
                {
                    addedTags.map( ({text,id}) =>
                        <li key={`${text}${id}`} className="select2-tag-child">
                            <span
                                className="tag-remove-button"
                                onClick={(e) => this.deleteTag(e)}
                            >
                                &#10005;
                            </span>
                            <p>{text}</p>
                        </li>
                    )
                }
                </ul>
                <div className="select2-tag-input-container">
                    <input
                        className="select2-tag-input"
                        type="text"
                        value={tagContext}
                        onChange={(e) => this.handleTagInputChange(e)}
                        onKeyUp={(e) => this.handleTagKeyPress(e)}
                        onClick={() => this.toggleInputDropdown()}
                        placeholder="Add category..."
                    />
                    {
                        !isInputDropdownHidden ?
                            <ul className="select2-tag-dropdown">
                                {
                                    dropdownContent.length !== 0 ? dropdownContent.map( ({text, id}) =>
                                        <li
                                            key={`${text}${id}`}
                                            className="select2-tag-dropdown-child"
                                            onClick={(e) => this.addTagFromCategory(e)}
                                        >
                                            {text}
                                        </li>
                                    ) :
                                        <li className="select2-tag-dropdown-child">Uygun seçim bulunamadı</li>
                                }
                            </ul>
                            :
                            ""
                    }
                </div>
            </div>
        );
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