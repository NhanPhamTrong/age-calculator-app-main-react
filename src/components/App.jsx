import "./App.scss"
import { useState } from "react"

export const App = () => {
    const [input, setInput] = useState({
        day: "",
        month: "",
        year: ""
    })

    const [error, setError] = useState({
        day: {
            isError: false,
            notice: ""
        },
        month: {
            isError: false,
            notice: ""
        },
        year: {
            isError: false,
            notice: ""
        }
    })

    const [result, setResult] = useState({
        day: "--",
        month: "--",
        year: "--"
    })

    const HandleChange = (e) => {
        setInput({...input, [e.target.name]: e.target.value})
    }

    const HandleSubmit = (e) => {
        e.preventDefault()

        const CheckLeapYear = (year) => (0 === year % 4) & (0 !== year % 100) || (0 === year % 400) ? true : false

        // Check errors
        // Check required "This field is required"

        const CheckRequiredError = () => {
            let inputList = [input.day, input.month, input.year]
            let newError = {}
            let count = 0
            const errorValueList = []

            inputList.forEach(element => {
                newError = {...newError, [Object.keys(input)[count]]: {
                    isError: element === "" ? true : false,
                    notice: element === "" ? "This field is required" : ""
                }}
                count += 1
            })
            setError({...newError})

            Object.values(newError).forEach(element => {
                errorValueList.push(element.isError)
            })

            return errorValueList.includes(true) ? true : false
        }

        // Check invalid day/month/year "must be a valid day/month" and "must be in the past"

        const CheckValidDayMonthYear = () => {
            let check = false

            if (input.day > 31) {
                check = true
                setError({...error, day: {
                    isError: true,
                    notice: "Must be a valid day"
                }})
            }

            if (input.month > 12) {
                check = true
                setError({...error, month: {
                    isError: true,
                    notice: "Must be a valid month"
                }})
            }

            if (input.year > (new Date().getFullYear())) {
                check = true
                setError({...error, year: {
                    isError: true,
                    notice: "Must be in the past"
                }})
            }

            return check
        }

        // Check invalid date "must be a valid date"

        const CheckValidDate = () => {
            const conditionOf30DaysMonth = [4, 6, 9, 11].indexOf(parseInt(input.month)) > -1 && input.day > 30
            const conditionOf31DaysMonth = [1, 3, 5, 7, 8, 10, 12].indexOf(parseInt(input.month)) > -1 && input.day > 31
            const conditionOfFeb = parseInt(input.month) === 2 && input.day > (CheckLeapYear(parseInt(input.year)) ? 29 : 28)

            let check = false

            if (conditionOf30DaysMonth || conditionOf31DaysMonth || conditionOfFeb) {
                check = true
                setError({
                    day: {
                        isError: true,
                        notice: "Must be a valid date"
                    },
                    month: {
                        isError: false,
                        notice: ""
                    },
                    year: {
                        isError: false,
                        notice: ""
                    }
                })
            }

            return check
        }

        // Calculation

        const CalculateDifference = () => {
            const today = new Date()

            // Calculate years and months

            let yearDifference = today.getFullYear() - (parseInt(input.year) + 1)
    
            let monthDifference = 12 - parseInt(input.month) + today.getMonth()
    
            // Month with 31, 30 or less days
            // Leap year or not
    
            const GetRemainDaysOfMonth = (month, day) => {    
                if ([4, 6, 9, 11].indexOf(month) > -1) {
                    return 30 - day
                }
                else if ([1, 3, 5, 7, 8, 10, 12].indexOf(month) > -1) {
                    return 31 - day
                }
                else return (CheckLeapYear(parseInt(input.year)) ? 29 : 28) - day
            }
    
            let dayDifference = GetRemainDaysOfMonth(parseInt(input.month), parseInt(input.day)) + today.getDate()

            // More than days of a month, add 1 month
            // More than 12 months, add 1 year
    
            if (dayDifference > 30) {
                dayDifference = dayDifference - 30
                monthDifference = monthDifference + 1
            }
    
            if (monthDifference >= 12) {
                monthDifference = monthDifference - 12
                yearDifference = yearDifference + 1
            }
    
            setResult({
                day: dayDifference,
                month: monthDifference,
                year: yearDifference
            })
        }

        if (CheckRequiredError() || CheckValidDayMonthYear() || CheckValidDate()) {
            setResult({
                day: "--",
                month: "--",
                year: "--"
            })
        } else CalculateDifference()
    }

    const CheckErrorForInput = () => {
        let errorValueList = []

        Object.values(error).forEach(element => {
            errorValueList.push(element.isError)
        })

        return errorValueList.includes(true) ? true : false
    }

    return (
        <>
            <main>
                <form onSubmit={HandleSubmit}>
                    <div>
                        <label htmlFor="day">Day</label>
                        <input
                            id="day"
                            type="number"
                            className={CheckErrorForInput() ? "error" : ""}
                            placeholder="DD"
                            name="day"
                            value={input.day}
                            onChange={HandleChange} />
                        <p className="error" style={{display : CheckErrorForInput() ? "block" : "none"}}>{error.day.notice}</p>
                    </div>
                    <div>
                        <label htmlFor="month">Month</label>
                        <input
                            id="month"
                            type="number"
                            className={CheckErrorForInput() ? "error" : ""}
                            placeholder="MM"
                            name="month"
                            value={input.month}
                            onChange={HandleChange} />
                        <p className="error" style={{display : CheckErrorForInput() ? "block" : "none"}}>{error.month.notice}</p>
                    </div>
                    <div>
                        <label htmlFor="year">Year</label>
                        <input
                            id="year"
                            type="number"
                            className={CheckErrorForInput() ? "error" : ""}
                            placeholder="YYYY"
                            name="year"
                            value={input.year}
                            onChange={HandleChange} />                        
                        <p className="error" style={{display : CheckErrorForInput() ? "block" : "none"}}>{error.year.notice}</p>
                    </div>
                    <hr />
                    <input
                        className="submit-btn"
                        type="submit" />
                </form>
                <div className="result">
                    <h1><span>{result.year}</span> years</h1>
                    <h1><span>{result.month}</span> months</h1>
                    <h1><span>{result.day}</span> days</h1>
                </div>
            </main>
            <div className="attribution">
                Challenge by <a href="https://www.frontendmentor.io?ref=challenge">Frontend Mentor</a>. 
                Coded by <a href="https://github.com/NhanPhamTrong">Nhan Pham</a>.
            </div>
        </>
    )
}