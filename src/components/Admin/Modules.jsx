import { useState } from "react"
import { Download, Upload } from "react-feather"

const DataManager = () => {
  const [exportType, setExportType] = useState("Prod")
  const [exportFormat, setExportFormat] = useState("json")
  const [importType, setImportType] = useState("Prod")
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/modules/export?type=${exportType}&format=${exportFormat}`)
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${exportType}.${exportFormat}`
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (error) {
      console.error("Erreur d'exportation :", error)
    }
    setLoading(false)
  }

  const handleImport = async () => {
    if (!file) return alert("Veuillez sélectionner un fichier JSON")
    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const jsonData = JSON.parse(event.target.result)
        console.log("Données importées :", jsonData)

        // Envoyer les données à l'API
        const response = await fetch("/api/modules/import", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ importType, data: jsonData }),
        })

        const result = await response.json()
        if(response.ok)
          alert("Données importées")
        else
          alert(result.error)
      } catch (error) {
        console.error("Erreur lors de la lecture du fichier JSON :", error)
      }
    }

    reader.readAsText(file)
    // setLoading(true)
    // const formData = new FormData()
    // formData.append("file", file)
    // formData.append("type", importType)

    // try {
    //   const res = await fetch("/api/_modules/import", {
    //     method: "POST",
    //     body: formData,
    //   })
    //   const data = await res.json()
    //   alert(data.message)
    // } catch (error) {
    //   console.error("Erreur d'importation :", error)
    // }
    // setLoading(false)
  }

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6">
      {/* EXPORTATION */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">🖨 Exportation des Données</h2>
        <div className="flex space-x-3">
          <select value={exportType} onChange={(e) => setExportType(e.target.value)} className="flex-1 p-2 rounded-lg border">
            <option value="Prod">Produits</option>
            <option value="Cat">Catégories</option>
            <option value="Cmd">Commandes</option>
            <option value="User">Utilisateurs</option>
          </select>
          <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)} className="p-2 rounded-lg border">
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
            <option value="xlsx">Excel</option>
            <option value="pdf">PDF</option>
          </select>
          <button onClick={handleExport} disabled={loading} className="p-2 bg-blue-600 text-white rounded-lg flex items-center">
            <Upload size={18} className="mr-2" /> Exporter
          </button>
        </div>
      </div>

      {/* IMPORTATION */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Importation des Données</h2>
        <div className="flex space-x-3">
          <select value={importType} onChange={(e) => setImportType(e.target.value)} className="flex-1 p-2 rounded-lg border">
            <option value="Prod">Produits</option>
            <option value="Cat">Catégories</option>
            <option value="Cmd">Commandes</option>
            <option value="User">Utilisateurs</option>
          </select>
          <input type="file" accept=".json" onChange={(e) => setFile(e.target.files[0])} className="p-2 border rounded-lg" />
          <button onClick={handleImport} disabled={loading} className="p-2 bg-green-600 text-white rounded-lg flex items-center">
          <Download size={18} className="mr-2" /> Importer
          </button>
        </div>
      </div>
    </div>
  )
}

export default DataManager