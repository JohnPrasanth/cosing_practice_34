import './index.css'

const CategoryList = props => {
  const {catItem, actCatId, key, changeCatId} = props
  const changeCat = () => {
    changeCatId(catItem.categoryId)
  }
  return (
    <li key={key} className="catItem">
      <button
        className={actCatId === catItem.categoryId ? 'active' : null}
        onClick={changeCat}
        type="button"
      >
        <p>{catItem.name}</p>
      </button>
    </li>
  )
}

const RatingList = props => {
  const {key, item, changeRating, actRatId} = props
  const {ratingId, imageUrl} = item
  const onclick = () => {
    changeRating(ratingId)
  }
  return (
    <li key={key} className="ratItem">
      <button type="button" onClick={onclick}>
        <img alt={`rating ${ratingId}`} src={imageUrl} />
        <p className={actRatId === ratingId ? 'active' : 'g'}>& Up</p>
      </button>
    </li>
  )
}

const FiltersGroup = props => {
  const {
    ratList,
    catList,
    changeCatId,
    titleValue,
    getNewSearch,
    changeTitle,
    actCatId,
    actRatId,
    changeRating,
    clearFilters,
  } = props
  const GetList = e => {
    if (e.key === 'Enter' && titleValue !== '') {
      getNewSearch()
    }
  }
  const onchange = e => {
    changeTitle(e.target.value)
  }

  return (
    <div className="filters-group-container">
      <input
        type="search"
        value={titleValue}
        onKeyDown={GetList}
        onChange={onchange}
        className="search"
        placeholder="Search"
      />
      <h2>Category</h2>
      <ul className="catList">
        {catList.map(each => (
          <CategoryList
            catItem={each}
            key={each.id}
            changeCatId={changeCatId}
            actCatId={actCatId}
          />
        ))}
      </ul>
      <h2>Rating</h2>
      {ratList.map(each => (
        <RatingList
          key={each.ratingId}
          item={each}
          changeRating={changeRating}
          actRatId={actRatId}
        />
      ))}
      <button className="clrFilterBtn" onClick={clearFilters} type="button">
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
