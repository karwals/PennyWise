import React from 'react'
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts'
/*Component that shows a bar chart of the budget information*/
function BarChartDashboard({ budgetList }) {
    return (
        <div className="border rounded-lg p-5">
            
            {/*Bar chart that shows the total spend and amount of each budget*/}
            <BarChart
                width={500}
                height={300}
                data={budgetList}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                    itemStyle={{ color: "black" }}
                    labelStyle={{ color: "black" }}
                    contentStyle={{ border: "rounded-lg", borderRadius: "8px" }}
                />
                <Legend formatter={(value) => <span className="text-black">{value}</span>} />
                {/*Two bars that show the total spend and amount of each budget*/}
                <Bar dataKey="amount" name="Amount" stackId="1" fill="#a7f3d0" animationDuration={2000} />
                <Bar dataKey="totalSpend" name="Total Spend" stackId="2" fill="#059f71" animationDuration={2000} />

            </BarChart>
        </div>
    )
}

export default BarChartDashboard