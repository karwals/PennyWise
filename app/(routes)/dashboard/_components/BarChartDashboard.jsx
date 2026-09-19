import React from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
/*Component that shows a bar chart of the budget information*/
function BarChartDashboard({ budgetList }) {
    return (
        <div className="border rounded-lg p-5">
            <h2 className="text-2xl text-primary font-bold mb-5">Activity</h2>
            {/*Bar chart that shows the total spend and amount of each budget*/}
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    alt="Bar chart showing budget activity"
                    data={budgetList}
                    margin={{ top: 5, right: 40, bottom: 5, left: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis/>
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
            </ResponsiveContainer>
        </div>
    )
}

export default BarChartDashboard