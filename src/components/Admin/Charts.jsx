import { useEffect, useState } from "react"
import { BarChart, Bar, PieChart, Pie, Cell, Tooltip, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"

export default function Dashboard() {
  const [cmds, setCmds] = useState([])
  const [prods, setProds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const cmdsRes = await fetch("http://localhost:5000/api/cmds/get")
      const prodsRes = await fetch("http://localhost:5000/api/prods/get")
      const cmdsData = await cmdsRes.json()
      const prodsData = await prodsRes.json()
      if (cmdsRes.ok && prodsRes.ok) {
        setCmds(cmdsData)
        setProds(prodsData)
      }
    } catch (error) {
      console.error("Erreur de chargement des données :", error)
    } finally {
      setLoading(false)
    }
  }

  const ordersByDate = cmds.reduce((acc, cmd) => {
    const date = new Date(cmd.date).toLocaleDateString()
    acc[date] = (acc[date] || 0) + cmd.total
    return acc
  }, {})
  const ordersChartData = Object.entries(ordersByDate).map(([date, total]) => ({ date, total }))

  const categoryCount = prods.reduce((acc, prod) => {
    acc[prod.cat] = (acc[prod.cat] || 0) + 1
    return acc
  }, {})
  const categoryChartData = Object.entries(categoryCount).map(([cat, count]) => ({ name: cat, value: count }))

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#d84c88"]

  return (
    <div className="p-6 mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">📊 Tableau de Bord</h1>
      {loading ? (
        <p className="text-center">Chargement des données...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 shadow-lg rounded-xl">
            <h2 className="text-xl font-semibold mb-4">💰 Ventes par Date</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ordersChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 shadow-lg rounded-xl">
            <h2 className="text-xl font-semibold mb-4">📦 Répartition des Catégories</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}