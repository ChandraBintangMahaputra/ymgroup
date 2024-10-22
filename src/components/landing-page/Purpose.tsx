import Section from "./Section";
import Heading from "../ui/Heading";
import {
  purposeimage1,
  purposeimage2,
  purposeimage3,
  purposeimage4,
} from "../../assets";
import { motion } from "framer-motion"; // Import only motion, no need for useAnimation or useInView

const Purpose = () => {
  return (
    <Section className="pt-30 mt-60 lg:pt-30 xl:pt-25" id="program" crosses>
      <div className="container flex flex-col items-center w-full h-fit">
        <div className="w-full mb-10 flex flex-col items-center lg:flex-row lg:justify-between lg:items-start">
          <motion.div
            className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }} // Always show the content without animation
            transition={{ duration: 0.6 }}
          >
            <Heading title="Youthmindset.id" />
            <div className="w-full lg:hidden">
              <motion.img
                src={purposeimage1}
                alt="Gambar"
                className="w-full h-auto object-cover rounded-lg mx-auto" // Center image on mobile
              />
            </div>
            <h4 className="text-n-4 max-w-96 text-lg mt-4 lg:mt-2 text-center mx-auto lg:flex lg:justify-center lg:text-center">
              Sudah hampir 4 tahun youthmindset.id hadir sebagai media yang
              memberikan konten motivasi dan membangun pola pikir anak muda di
              Indonesia, bahkan dunia. Youthmindset.id menjadi salah satu akun
              motivasi dari Indonesia yang banyak pengikutnya di Instagram.
            </h4>
            <a
              href="https://www.instagram.com/youthmindset.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-7 px-6 py-2 max-w-96 mx-auto flex justify-center items-center text-white bg-blue-500 rounded hover:bg-blue-600 transition duration-200"
            >
              Kunjungi Instagram Kami
            </a>
          </motion.div>
          <motion.div
            className="hidden lg:block w-full lg:w-1/2 flex justify-center lg:justify-end mt-4 lg:pr-8 lg:mt-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }} // Always show the content without animation
            transition={{ duration: 0.6 }}
          >
            <motion.img
              src={purposeimage1}
              alt="Gambar tujuan fieldtrip"
              className="w-70 h-auto object-cover rounded-lg"
            />
          </motion.div>
        </div>

        {/* Second Block */}
        <div className="w-full mt-10 mb-10 flex flex-col items-center lg:flex-row lg:justify-between lg:items-start">
          <motion.div
            className="w-full lg:w-1/2 flex justify-center items-center mb-4 lg:mb-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }} // Always show the content without animation
            transition={{ duration: 0.6 }}
          >
            <motion.img
              src={purposeimage2}
              alt="Gambar"
              className="w-full h-auto object-cover rounded-lg mx-auto" // Center image on mobile
            />
          </motion.div>

          {/* Kolom Teks */}
          <motion.div
            className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }} // Always show the content without animation
            transition={{ duration: 0.6 }}
          >
            <Heading title="Scaling Yourself" />
            <h4 className="text-n-4 max-w-96 text-lg mt-4 lg:mt-2 text-center mx-auto lg:flex lg:justify-center lg:text-center">
              Memberikan bimbingan kepada mahasiswa di Indonesia perihal
              kepemimpinan, prestasi (capaian unggulan), serta strategi lolos
              beasiswa melalui bimbingan mentor (Mahasiswa berprestasi dan
              expert)
            </h4>
            <a
              href="https://scaling-yourself.youthmindset.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-7 px-6 py-2 max-w-96 mx-auto flex justify-center items-center text-white bg-blue-500 rounded hover:bg-blue-600 transition duration-200"
            >
              Kunjungi Website Kami
            </a>
          </motion.div>
        </div>

        {/* Third Block */}
        <div className="w-full mt-10 mb-10 flex flex-col items-center lg:flex-row lg:justify-between lg:items-start">
          <motion.div
            className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }} // Always show the content without animation
            transition={{ duration: 0.6 }}
          >
            <Heading title="Ambiskerja.com" />
            <div className="w-full lg:hidden">
              <motion.img
                src={purposeimage3}
                alt="Gambar"
                className="w-full h-auto object-cover rounded-lg mx-auto" // Center image on mobile
              />
            </div>
            <h4 className="text-n-4 max-w-96 text-lg mt-4 lg:mt-2 text-center mx-auto lg:flex lg:justify-center lg:text-center">
              Platform freelancer khusus mahasiswa guna menciptakan lulusan yang
              unggul dan siap kerja. Mahasiswa dapat menawarkan jasa mereka
              melalui website ambiskerja.com. Ambiskerja.com memiliki algoritma
              berkeadilan (freelancer yang pekerjaannya sedang on going tidak
              bisa menerima pekerjaan baru sebelum menyelesaikan pekerjaannya)
              sehingga peluang mahasiswa untuk mendapatkan pekerjaan jauh lebih
              besar dibandingkan platform freelancer lainnya.
            </h4>
            <a
              href="https://ambiskerja.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-7 px-6 py-2 max-w-96 mx-auto flex justify-center items-center text-white bg-blue-500 rounded hover:bg-blue-600 transition duration-200"
            >
              Kunjungi Website Kami
            </a>
          </motion.div>
          <motion.div
            className="hidden lg:block w-full lg:w-1/2 flex justify-center lg:justify-end mt-4 lg:pr-8 lg:mt-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }} // Always show the content without animation
            transition={{ duration: 0.6 }}
          >
            <motion.img
              src={purposeimage3}
              alt="Gambar tujuan fieldtrip"
              className="w-70 h-auto object-cover rounded-lg"
            />
          </motion.div>
        </div>

        {/* Fourth Block */}
        <div className="w-full mt-10 mb-10 flex flex-col lg:flex-row lg:justify-between lg:items-start">
          <motion.div
            className="w-full lg:w-1/2 flex justify-center lg:justify-start mb-4 lg:mb-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }} // Always show the content without animation
            transition={{ duration: 0.6 }}
          >
            <motion.img
              src={purposeimage4}
              alt="Gambar"
              className="w-full h-auto object-cover rounded-lg mx-auto" // Center image on mobile
            />
          </motion.div>

          {/* Kolom Teks */}
          <motion.div
            className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }} // Always show the content without animation
            transition={{ duration: 0.6 }}
          >
            <Heading title="Ymthings.id" />
            <h4 className="text-n-4 max-w-96 text-lg mt-4 lg:mt-2 text-center mx-auto lg:flex lg:justify-center lg:text-center">
              Memproduksi merchandise, baju, dan aneka produk fashion lainnya
              yang menjadi media untuk anak muda berekspresi
            </h4>
            <a
              href="https://ymthings.youthmindset.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-7 px-6 py-2 max-w-96 mx-auto flex justify-center items-center text-white bg-blue-500 rounded hover:bg-blue-600 transition duration-200"
            >
              Kunjungi Website Kami
            </a>
          </motion.div>
        </div>
      </div>
    </Section>
  );
};

export default Purpose;
