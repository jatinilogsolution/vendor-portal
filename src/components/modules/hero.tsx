
import Image from 'next/image'
import Link from 'next/link'
 


export default function Hero() {

  return (
    <div className="bg-gray-900">

      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-6 lg:px-8"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <h2 className="text-xl font-bold">
                <span className="text-blue-600">Vendor</span> Portal
              </h2>
            </a>
          </div>

          <div className="flex lg:flex-1 lg:justify-end">
            <a href="/auth/login" className="text-sm/6 font-semibold text-white">
              Log in <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </nav>

      </header>


      <div className="relative h-screen w-screen isolate overflow-hidden pt-14">
        <Image
          alt="hero"
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2830&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply"
          fill
          priority
          className="absolute inset-0 -z-10 size-full object-cover"
        />


        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              Manage Your Vendor Operations Seamlessly
            </h1>
            <p className="mt-8 text-lg font-medium text-gray-300 sm:text-xl/8">
              Access orders, track invoices, and collaborate with your partners
              in one centralized platform designed for vendors.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/dashboard"
                className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
              >
                Get Started
              </Link>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
