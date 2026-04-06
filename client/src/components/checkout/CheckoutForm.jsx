import LoadingSpinner from "../common/LoadingSpinner";

function CheckoutForm({ values, errors, loading, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Shipping Address</h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500" htmlFor="fullName">
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            value={values.fullName}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none ring-[#1f3b7a] focus:ring"
            placeholder="John Doe"
          />
          {errors.fullName ? <p className="mt-1 text-sm text-red-600">{errors.fullName}</p> : null}
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500" htmlFor="phone">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            value={values.phone}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none ring-[#1f3b7a] focus:ring"
            placeholder="+1 202 555 0100"
          />
          {errors.phone ? <p className="mt-1 text-sm text-red-600">{errors.phone}</p> : null}
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500" htmlFor="country">
            Country
          </label>
          <input
            id="country"
            name="country"
            value={values.country}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none ring-[#1f3b7a] focus:ring"
            placeholder="United States"
          />
          {errors.country ? <p className="mt-1 text-sm text-red-600">{errors.country}</p> : null}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500" htmlFor="addressLine1">
            Address Line
          </label>
          <input
            id="addressLine1"
            name="addressLine1"
            value={values.addressLine1}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none ring-[#1f3b7a] focus:ring"
            placeholder="221B Baker Street"
          />
          {errors.addressLine1 ? <p className="mt-1 text-sm text-red-600">{errors.addressLine1}</p> : null}
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500" htmlFor="city">
            City
          </label>
          <input
            id="city"
            name="city"
            value={values.city}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none ring-[#1f3b7a] focus:ring"
            placeholder="London"
          />
          {errors.city ? <p className="mt-1 text-sm text-red-600">{errors.city}</p> : null}
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500" htmlFor="postalCode">
            Postal Code
          </label>
          <input
            id="postalCode"
            name="postalCode"
            value={values.postalCode}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none ring-[#1f3b7a] focus:ring"
            placeholder="NW1 6XE"
          />
          {errors.postalCode ? <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p> : null}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1f3b7a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#182f63] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <LoadingSpinner size="sm" />
            Placing Order...
          </>
        ) : (
          "Place Order"
        )}
      </button>
    </form>
  );
}

export default CheckoutForm;
