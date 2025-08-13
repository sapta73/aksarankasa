import { supabase } from "./config";

// Tambahan query untuk mapel
export const getMataPelajaran = async () => {
  const { data, error } = await supabase
    .from("mata_pelajaran")
    .select("*")
    .eq("is_active", true)
    .order("nama");

  if (error) {
    console.error("Error mengambil data mata pelajaran:", error);
    return [];
  }
  return data;
};

// Update query soal dengan filter mapel
export const getSoalWithMapel = async (level, mapelId = null) => {
  let query = supabase
    .from("soal")
    .select(
      `
      *,
      mata_pelajaran (
        nama,
        kode
      )
    `
    )
    .eq("level", level);

  if (mapelId) {
    query = query.eq("mapel_id", mapelId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error mengambil soal:", error);
    return [];
  }
  return data;
};
