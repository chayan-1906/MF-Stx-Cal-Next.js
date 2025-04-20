/*
'use client';

import React, {useState} from 'react';
// import {CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {ArrowUpRight, BarChart3, Calculator, DollarSign, Download, FileText, HelpCircle, History, PieChart as PieChartIcon, Settings} from 'lucide-react';
import {Button} from "@/components/ui/button";

// Custom table components since @/components/ui/table is not available
const Table = ({children, className = ""}) => (
    <div className={`w-full overflow-auto ${className}`}>
        <table className="w-full caption-bottom text-sm">{children}</table>
    </div>
);

const TableHeader = ({children}) => <thead className="[&_tr]:border-b">{children}</thead>;
const TableBody = ({children}) => <tbody className="[&_tr:last-child]:border-0">{children}</tbody>;
const TableHead = ({children, className = ""}) => (
    <th className={`h-12 px-4 text-left align-middle font-medium text-slate-500 dark:text-slate-400 ${className}`}>{children}</th>
);
const TableRow = ({children}) => <tr className="border-b border-slate-200 dark:border-slate-700">{children}</tr>;
const TableCell = ({children, className = ""}) => (
    <td className={`p-4 align-middle ${className}`}>{children}</td>
);

// Custom UI components since shadcn components are not available
const Card = ({children, className = ""}) => (
    <div className={`rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 ${className}`}>
        {children}
    </div>
);

const CardHeader = ({children, className = ""}) => (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
);

const CardTitle = ({children, className = ""}) => (
    <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
);

const CardDescription = ({children, className = ""}) => (
    <p className={`text-sm text-slate-500 dark:text-slate-400 ${className}`}>{children}</p>
);

const CardContent = ({children, className = ""}) => (
    <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

const CardFooter = ({children, className = ""}) => (
    <div className={`flex items-center p-6 pt-0 ${className}`}>{children}</div>
);

const Tabs = ({children, value, onValueChange, className = ""}) => (
    <div className={`w-full ${className}`}>
        {React.Children.map(children, (child) => {
            if (child.props.value === value) return child;
            return null;
        })}
    </div>
);

const TabsContent = ({children, value}) => <div>{children}</div>;

const Label = ({children, htmlFor, className = ""}) => (
    <label htmlFor={htmlFor} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
        {children}
    </label>
);

const Input = ({id, type = "text", className = "", value, onChange}) => (
    <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        className={`flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:placeholder:text-slate-400 ${className}`}
    />
);

const Select = ({children, value, onValueChange}) => {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-slate-800 dark:bg-slate-950"
            >
                {children}
            </select>
        </div>
    );
};

const SelectItem = ({children, value}) => (
    <option value={value}>{children}</option>
);

const Badge = ({children, variant = "default", className = ""}) => {
    const variantClasses = {
        default: "bg-blue-500 text-white",
        secondary: "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50",
        outline: "text-slate-950 border border-slate-200 dark:text-slate-50 dark:border-slate-800",
    };

    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
    );
};

export default function MFStxCalDashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [holdingPeriod, setHoldingPeriod] = useState('short');
    const [investmentAmount, setInvestmentAmount] = useState('10000');
    const [currentValue, setCurrentValue] = useState('12500');
    const [taxResults, setTaxResults] = useState(null);

    // Sample data for charts
    const portfolioData = [
        {name: 'Jan', value: 10000},
        {name: 'Feb', value: 10200},
        {name: 'Mar', value: 10500},
        {name: 'Apr', value: 10300},
        {name: 'May', value: 10800},
        {name: 'Jun', value: 11200},
        {name: 'Jul', value: 11500},
        {name: 'Aug', value: 11800},
        {name: 'Sep', value: 12100},
        {name: 'Oct', value: 12300},
        {name: 'Nov', value: 12400},
        {name: 'Dec', value: 12500},
    ];

    const sampleHoldings = [
        {fund: 'Vanguard Total Stock', value: 4500, returns: '+12.5%', allocation: '36%', color: '#1e40af'},
        {fund: 'Fidelity 500 Index', value: 3200, returns: '+8.3%', allocation: '25.6%', color: '#3b82f6'},
        {fund: 'Schwab International', value: 2800, returns: '+5.1%', allocation: '22.4%', color: '#60a5fa'},
        {fund: 'iShares Bond ETF', value: 2000, returns: '+2.2%', allocation: '16%', color: '#93c5fd'},
    ];

    // Prepare data for pie chart
    const pieChartData = sampleHoldings.map(holding => ({
        name: holding.fund,
        value: parseFloat(holding.allocation),
        actualValue: holding.value,
        color: holding.color
    }));

    const calculateTax = () => {
        const investment = parseFloat(investmentAmount);
        const value = parseFloat(currentValue);
        const gains = value - investment;

        let taxRate = 0;
        if (holdingPeriod === 'short') {
            taxRate = 0.15; // 15% short-term capital gains rate
        } else {
            taxRate = 0.10; // 10% long-term capital gains rate
        }

        const taxOwed = gains * taxRate;
        const netProfit = gains - taxOwed;
        const effectiveTaxRate = (taxOwed / gains) * 100;

        setTaxResults({
            investment,
            currentValue: value,
            capitalGains: gains,
            taxRate: taxRate * 100,
            taxOwed,
            netProfit,
            effectiveTaxRate
        });
    };

    const resetCalculator = () => {
        setInvestmentAmount('10000');
        setCurrentValue('12500');
        setHoldingPeriod('short');
        setTaxResults(null);
    };

    const COLORS = ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'];

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
            {/!* Sidebar *!/}
            <div className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                        <Calculator className="mr-2 h-5 w-5 text-blue-500"/>
                        MFStxCal
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Mutual Fund Tax Calculator</p>
                </div>

                <nav className="flex-1 p-4">
                    <div className="space-y-1">
                        <Button
                            variant={activeTab === 'dashboard' ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => setActiveTab('dashboard')}
                        >
                            <BarChart3 className="mr-2 h-4 w-4"/>
                            Dashboard
                        </Button>
                        <Button
                            variant={activeTab === 'calculator' ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => setActiveTab('calculator')}
                        >
                            <Calculator className="mr-2 h-4 w-4"/>
                            Tax Calculator
                        </Button>
                        <Button
                            variant={activeTab === 'portfolio' ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => setActiveTab('portfolio')}
                        >
                            <PieChartIcon className="mr-2 h-4 w-4"/>
                            Portfolio
                        </Button>
                        <Button
                            variant={activeTab === 'history' ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => setActiveTab('history')}
                        >
                            <History className="mr-2 h-4 w-4"/>
                            History
                        </Button>
                        <Button
                            variant={activeTab === 'reports' ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => setActiveTab('reports')}
                        >
                            <FileText className="mr-2 h-4 w-4"/>
                            Reports
                        </Button>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Settings</h3>
                        <Button variant="ghost" className="w-full justify-start">
                            <Settings className="mr-2 h-4 w-4"/>
                            Preferences
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                            <HelpCircle className="mr-2 h-4 w-4"/>
                            Help & Support
                        </Button>
                    </div>
                </nav>
            </div>

            {/!* Main content *!/}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/!* Header *!/}
                <header className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                    <div className="md:hidden flex items-center">
                        <Calculator className="h-5 w-5 text-blue-500"/>
                        <span className="ml-2 font-bold">MFStxCal</span>
                    </div>

                    <div className="flex items-center">
                        <Badge variant="outline" className="mr-2">Pro Plan</Badge>
                        <Button variant="ghost" size="icon">
                            <Settings className="h-5 w-5"/>
                        </Button>
                    </div>
                </header>

                {/!* Content area *!/}
                <main className="flex-1 overflow-auto p-4 md:p-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsContent value="dashboard" className="mt-0">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">$12,500.00</div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center mt-1">
                                            <ArrowUpRight className="h-3 w-3 text-green-500 mr-1"/>
                                            <span className="text-green-500 font-medium">+25%</span>
                                            <span className="ml-1">since initial investment</span>
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">Estimated Tax Liability</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-amber-500">$375.00</div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            Based on current gains and holding period
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">Net Profit After Tax</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-green-500">$2,125.00</div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            After estimated tax deductions
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2 mt-4">
                                <Card className="col-span-2 md:col-span-1">
                                    <CardHeader>
                                        <CardTitle>Portfolio Performance</CardTitle>
                                        <CardDescription>Value changes over time</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-80">
                                            {/!*<ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={portfolioData}>
                                                    <CartesianGrid strokeDasharray="3 3"/>
                                                    <XAxis dataKey="name"/>
                                                    <YAxis/>
                                                    <Tooltip/>
                                                    <Legend/>
                                                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2}/>
                                                </LineChart>
                                            </ResponsiveContainer>*!/}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="col-span-2 md:col-span-1">
                                    <CardHeader>
                                        <CardTitle>Fund Allocation</CardTitle>
                                        <CardDescription>Distribution of your investments</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex flex-col items-center">
                                        <div className="h-64 w-64 mb-4">
                                            {/!*<ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={pieChartData}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        outerRadius={80}
                                                        fill="#8884d8"
                                                        dataKey="value"
                                                        nameKey="name"
                                                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                    >
                                                        {pieChartData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]}/>
                                                        ))}
                                                    </Pie>
                                                    <Tooltip formatter={(value, name, props) => [`$${props.payload.actualValue}`, name]}/>
                                                </PieChart>
                                            </ResponsiveContainer>*!/}
                                        </div>

                                        <div className="w-full overflow-auto max-h-64 mt-2">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Fund</TableHead>
                                                        <TableHead className="text-right">Value</TableHead>
                                                        <TableHead className="text-right">Returns</TableHead>
                                                        <TableHead className="text-right">Allocation</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {sampleHoldings.map((holding, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>
                                                                <div className="flex items-center">
                                                                    <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: holding.color}}></div>
                                                                    {holding.fund}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-right">${holding.value.toLocaleString()}</TableCell>
                                                            <TableCell className="text-right text-green-500">{holding.returns}</TableCell>
                                                            <TableCell className="text-right">{holding.allocation}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="calculator" className="mt-0 space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Mutual Fund Tax Calculator</CardTitle>
                                    <CardDescription>Calculate your capital gains tax liability</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="investmentAmount">Initial Investment Amount ($)</Label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-500"/>
                                                <Input
                                                    id="investmentAmount"
                                                    type="number"
                                                    value={investmentAmount}
                                                    onChange={(e) => setInvestmentAmount(e.target.value)}
                                                    className="pl-9"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="currentValue">Current Value ($)</Label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-500"/>
                                                <Input
                                                    id="currentValue"
                                                    type="number"
                                                    value={currentValue}
                                                    onChange={(e) => setCurrentValue(e.target.value)}
                                                    className="pl-9"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="holdingPeriod">Holding Period</Label>
                                        <Select value={holdingPeriod} onValueChange={setHoldingPeriod}>
                                            <SelectItem value="short">Short-term (Less than 1 year)</SelectItem>
                                            <SelectItem value="long">Long-term (More than 1 year)</SelectItem>
                                        </Select>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {holdingPeriod === 'short'
                                                ? "Short-term capital gains are taxed at 15% (example rate)"
                                                : "Long-term capital gains are taxed at 10% (example rate)"}
                                        </p>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-4">
                                    <Button variant="outline" onClick={resetCalculator}>Reset</Button>
                                    <Button onClick={calculateTax}>Calculate Tax</Button>
                                </CardFooter>
                            </Card>

                            {taxResults && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Tax Calculation Results</CardTitle>
                                        <CardDescription>Based on your inputs</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell className="font-medium">Initial Investment</TableCell>
                                                    <TableCell className="text-right">${taxResults.investment.toFixed(2)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-medium">Current Value</TableCell>
                                                    <TableCell className="text-right">${taxResults.currentValue.toFixed(2)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-medium">Capital Gains</TableCell>
                                                    <TableCell className="text-right text-green-500">${taxResults.capitalGains.toFixed(2)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-medium">Tax Rate</TableCell>
                                                    <TableCell className="text-right">{taxResults.taxRate.toFixed(1)}%</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-medium">Tax Owed</TableCell>
                                                    <TableCell className="text-right text-amber-500">${taxResults.taxOwed.toFixed(2)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-medium">Net Profit After Tax</TableCell>
                                                    <TableCell className="text-right text-green-500">${taxResults.netProfit.toFixed(2)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-medium">Effective Tax Rate</TableCell>
                                                    <TableCell className="text-right">{taxResults.effectiveTaxRate.toFixed(2)}%</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                    <CardFooter className="justify-end border-t border-slate-200 dark:border-slate-700 pt-4">
                                        <Button variant="outline" className="flex items-center">
                                            <Download className="mr-2 h-4 w-4"/>
                                            Export Results
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )}
                        </TabsContent>

                        <TabsContent value="portfolio" className="mt-0">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Portfolio Analysis</CardTitle>
                                    <CardDescription>Manage and analyze your mutual fund investments</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-500 dark:text-slate-400">Your portfolio details will appear here</p>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="history" className="mt-0">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Transaction History</CardTitle>
                                    <CardDescription>View your past tax calculations and transactions</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-500 dark:text-slate-400">Your transaction history will appear here</p>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="reports" className="mt-0">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tax Reports</CardTitle>
                                    <CardDescription>Generate and download tax reports</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-500 dark:text-slate-400">Your tax reports will appear here</p>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </main>
            </div>
        </div>
    );
}
*/
