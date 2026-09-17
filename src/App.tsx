import { useState } from "react";
import { Folder, FileCode, CheckCircle2, Copy, FileText, Code2 } from "lucide-react";

interface FileNode {
  name: string;
  path: string;
  type: "file" | "folder";
  isEmpty: boolean;
  children?: FileNode[];
}

export default function App() {
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const tree: FileNode[] = [
    {
      name: "backend",
      path: "backend/",
      type: "folder",
      isEmpty: false,
      children: [
        {
          name: "src",
          path: "backend/src/",
          type: "folder",
          isEmpty: false,
          children: [
            { name: "controllers", path: "backend/src/controllers/", type: "folder", isEmpty: true },
            { name: "routes", path: "backend/src/routes/", type: "folder", isEmpty: true },
            { name: "models", path: "backend/src/models/", type: "folder", isEmpty: true },
            { name: "middleware", path: "backend/src/middleware/", type: "folder", isEmpty: true },
            { name: "config", path: "backend/src/config/", type: "folder", isEmpty: true },
            { name: "app.js", path: "backend/src/app.js", type: "file", isEmpty: true },
            { name: "server.js", path: "backend/src/server.js", type: "file", isEmpty: true },
          ],
        },
        { name: ".env", path: "backend/.env", type: "file", isEmpty: true },
        { name: "package.json", path: "backend/package.json", type: "file", isEmpty: true },
        { name: "README.md", path: "backend/README.md", type: "file", isEmpty: true },
      ],
    },
    {
      name: "frontend",
      path: "frontend/",
      type: "folder",
      isEmpty: false,
      children: [
        {
          name: "src",
          path: "frontend/src/",
          type: "folder",
          isEmpty: false,
          children: [
            { name: "components", path: "frontend/src/components/", type: "folder", isEmpty: true },
            { name: "pages", path: "frontend/src/pages/", type: "folder", isEmpty: true },
            { name: "services", path: "frontend/src/services/", type: "folder", isEmpty: true },
            { name: "assets", path: "frontend/src/assets/", type: "folder", isEmpty: true },
            { name: "App.jsx", path: "frontend/src/App.jsx", type: "file", isEmpty: true },
            { name: "main.jsx", path: "frontend/src/main.jsx", type: "file", isEmpty: true },
          ],
        },
        { name: "package.json", path: "frontend/package.json", type: "file", isEmpty: true },
        { name: "README.md", path: "frontend/README.md", type: "file", isEmpty: true },
      ],
    },
    { name: "README.md", path: "README.md", type: "file", isEmpty: true },
  ];

  const handleCopy = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const renderTree = (nodes: FileNode[], level = 0) => {
    return (
      <div className="space-y-1">
        {nodes.map((node) => (
          <div key={node.path}>
            <div
              style={{ paddingLeft: `${level * 18 + 8}px` }}
              className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-neutral-100 transition-colors group text-xs font-mono"
            >
              <div className="flex items-center gap-2">
                {node.type === "folder" ? (
                  <Folder className="w-4 h-4 text-amber-500 shrink-0" />
                ) : node.name.endsWith(".js") || node.name.endsWith(".jsx") ? (
                  <Code2 className="w-4 h-4 text-sky-500 shrink-0" />
                ) : (
                  <FileText className="w-4 h-4 text-neutral-400 shrink-0" />
                )}
                <span className={node.type === "folder" ? "font-semibold text-neutral-800" : "text-neutral-700"}>
                  {node.name}
                </span>
                {node.isEmpty && (
                  <span className="text-[10px] font-sans px-1.5 py-0.2 bg-neutral-200/70 text-neutral-600 rounded">
                    trống (0 bytes)
                  </span>
                )}
              </div>

              <button
                onClick={() => handleCopy(node.path)}
                title="Sao chép đường dẫn"
                className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-neutral-900 p-1 rounded transition-opacity"
              >
                {copiedPath === node.path ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {node.children && renderTree(node.children, level + 1)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col items-center justify-center p-6 antialiased">
      <main className="w-full max-w-3xl bg-white border border-neutral-200 rounded-2xl shadow-xs p-6 sm:p-10 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neutral-100 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Đã khởi tạo cây thư mục trống
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
              shop-quan-ao/
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Toàn bộ các thư mục và tập tin đã được thiết lập sẵn với mã nguồn rỗng (0 dòng code), sẵn sàng để bạn tự viết code theo ý muốn.
            </p>
          </div>
        </div>

        {/* Tree view */}
        <div className="bg-neutral-50/80 border border-neutral-200 rounded-xl p-4 max-h-[440px] overflow-y-auto">
          {renderTree(tree)}
        </div>

        {/* Info Box */}
        <div className="rounded-xl border border-neutral-200 p-4 bg-white text-xs space-y-2">
          <div className="font-semibold text-neutral-800">
            Trạng thái tập tin:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-neutral-600">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Backend: <code className="font-mono text-neutral-800">app.js, server.js</code> rỗng</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Frontend: <code className="font-mono text-neutral-800">App.jsx, main.jsx</code> rỗng</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Cấu hình: <code className="font-mono text-neutral-800">.env, package.json</code> rỗng</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Tài liệu: <code className="font-mono text-neutral-800">README.md</code> rỗng</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-8 text-xs text-neutral-400 text-center">
        shop-quan-ao • Kiến trúc chuẩn Frontend & Backend • Mã nguồn sạch
      </footer>
    </div>
  );
}
