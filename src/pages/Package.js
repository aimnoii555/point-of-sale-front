import { useEffect, useState } from "react";
import config from "../config";
import axios from "axios";
import Modal from "../components/Modal"; // ✅ default import
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ResponseError from "../utils/ResponseError";
import PackageNavbar from "../components/PackageNavbar";

export function Package() {
  const [packages, setPackages] = useState([]);
  const [yourPackage, setYourPackage] = useState({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(config.path + "/package/list");
      setPackages(res.data);
    } catch (error) {
      console.error("error =", error.message);
    }
  };

  const choosePackage = (item) => {
    setYourPackage(item);
    setOpenModal(true);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        package_id: yourPackage.id,
        name,
        phone,
        password,
      };

      Swal.fire({
        title: "ยืนยันการสมัคร",
        text: `ต้องการสมัครแพ็กเกจ ${yourPackage.name} หรือไม่?`,
        icon: "question",
        showConfirmButton: true,
        showCancelButton: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res = await axios.post(
              config.path + "/package/member-register",
              payload
            );

            if (res.data.status) {
              Swal.fire({
                title: "สมัครสำเร็จ",
                icon: "success",
                timer: 2000,
              });
              setOpenModal(false);
              navigate("/login");
            } else {
              Swal.fire({
                title: "สมัครไม่สำเร็จ",
                text: res.data.message,
                icon: "error",
                timer: 2000,
              });
            }
          } catch (err) {
            ResponseError(err.message)
          }
        }
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <>
      <PackageNavbar onClick={() => {
        navigate('/login')
      }} />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">
          Package
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 mb-6">
          เลือกแพ็กเกจที่เหมาะกับคุณ
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {packages.map((item, key) => (
            <div
              key={key}
              className="border border-neutral-300 dark:border-neutral-700 rounded-2xl p-6 bg-white dark:bg-neutral-900 shadow-sm flex flex-col items-center justify-between text-center"
            >
              <div>
                <h3 className="text-lg font-semibold text-emerald-500 mb-1">
                  {item.name}
                </h3>
                <p className="text-sm text-neutral-500 mb-1">
                  {item.bill_amount.toLocaleString("th-TH")} บิล / เดือน
                </p>
                <p className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
                  {item.price.toLocaleString("th-TH")} บาท
                </p>
              </div>
              <button
                onClick={() => choosePackage(item)}
                className="mt-4 px-4 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-sm hover:opacity-90 transition"
              >
                สมัคร
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title="สมัครใช้บริการ"
      >
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              แพ็กเกจที่เลือก
            </label>
            <div className="mt-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-100">
              {yourPackage.name
                ? `${yourPackage.name} — ${yourPackage.price?.toLocaleString(
                  "th-TH"
                )} บาท / เดือน`
                : "ยังไม่ได้เลือกแพ็กเกจ"}
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">ชื่อร้าน</label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">เบอร์โทรศัพท์</label>
            <input
              type="tel"
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">รหัสผ่าน</label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-500"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => setOpenModal(false)}
              className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-800"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-sm font-medium hover:opacity-90"
            >
              ยืนยันการสมัคร
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
