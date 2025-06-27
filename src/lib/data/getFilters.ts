export const getProductFilters = async (category: string) => {
  try {
    const response = await fetch(
      "https://search.lfyfashion.com/indexes/products/facet-search",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer ZTA4MWI2NmM1ZDg5YjkyMDJjMTY2OGJk",
        },
        body: JSON.stringify({
          facetName: "brand",
          filter: `(categories = '${category}')`,
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    let filteredData = data.facetHits.filter((hit: any) => hit.count > 0)

    return filteredData
  } catch (error) {
    console.error("Error fetching product filters:", error)
    return null
  }
}

export const getGenderFilters = async () => {
  try {
    const response = await fetch(
      "https://search.lfyfashion.com/indexes/products/facet-search",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer ZTA4MWI2NmM1ZDg5YjkyMDJjMTY2OGJk",
        },
        body: JSON.stringify({ facetName: "gender" }),
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching product filters:", error)
    return null
  }
}

export const getFilterdProducts = async (
  filters: any,
  categories: any,
  pageNo: number
) => {

  const { brand, gender } = filters
  if (!brand && !gender) {
    return {}
  }
  let limit = 28
  let offset = (pageNo - 1) * 28
  let brandFilter = ""
  let categoryFilter = ""
  let genderFilter = ""

  if (typeof brand === "string") {
    const brandsArray = brand.split(",").map((brand) => brand.trim())
    brandFilter = `(${brandsArray
      .map((brand) => `brand = '${brand}'`)
      .join(" OR ")})`
  }

  if (typeof categories === "string") {
    const categoriesArray = categories
      .split(",")
      .map((category) => category.trim())
    categoryFilter = `(${categoriesArray
      .map((category) => `categories = '${category}'`)
      .join(" OR ")})`
  }

  if (typeof gender === "string") {
    const genderArray = gender.split(",").map((g) => g.trim())
    genderFilter = `(${genderArray.map((g) => `gender = '${g}'`).join(" OR ")})`
  }

  let filtersArray = []
  if (brandFilter) filtersArray.push(brandFilter)
  if (categoryFilter) filtersArray.push(categoryFilter)
  if (genderFilter) filtersArray.push(genderFilter)

  let finalFilter = filtersArray.length > 0 ? filtersArray.join(" AND ") : ""

  try {
    const response = await fetch(
      "https://search.lfyfashion.com/indexes/products/search",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer ZTA4MWI2NmM1ZDg5YjkyMDJjMTY2OGJk",
        },
        body: JSON.stringify({
          q: "",
          filter: finalFilter,
          attributesToRetrieve: ["id"],
          limit: limit,
          offset: offset,
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()

    return data
  } catch (error) {
    console.error("Error fetching filtered Products ", error)
    return null
  }
}
