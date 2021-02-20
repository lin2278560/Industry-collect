class Filter {
    filed = String;
    filterType = String;
}

class FilterTerms extends Filter {
    values = Array(Object);
}

class FilterTerm extends Filter {
    value = Object;
}

class FilterRange extends Filter {
    form = Object;
    to = Object;
}

class FilterExists extends Filter {
}

