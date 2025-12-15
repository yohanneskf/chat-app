import LoginForm from "@/components/LoginForm";
import { AuthProvider } from "@/contexts/AuthContext";

export default function Home() {
  return (
    <AuthProvider>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <header className="py-8">
            <h1 className="text-4xl font-bold text-center text-gray-800">
              Real-Time Chat App
            </h1>
            <p className="text-center text-gray-600 mt-2">
              Connect with friends in real-time
            </p>
          </header>
          <LoginForm />
        </div>
      </main>
    </AuthProvider>
  );
}
