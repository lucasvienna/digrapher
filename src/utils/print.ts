function print_r(array: Array<any>, list: boolean = false): string {
	if (array.length === 0) return '{}'

	let output = ''

	function _formatArray(obj: Array<any>) {
		if (obj.length === 0) return '{}'

		let retVal = '{'
		obj.forEach(x => (retVal += `${x},`))
		retVal = retVal.slice(0, retVal.length - 1)
		retVal += '}'

		return retVal
	}

	if (list) {
		output += '['
		array.forEach(x => (output += `${_formatArray(x)},`))
		if (output.charAt(output.length - 1) !== '[')
			output = output.slice(0, output.length - 1)
		output += ']'
	} else {
		output = _formatArray(array)
	}

	return output
}

function print_l(array: Array<any>): string {
	if (array.length === 0) return '{}'

	let output = ''

	function _formatArray(obj: Array<any>) {
		if (obj.length === 0) return '{}'

		let retVal = '['
		obj.forEach(x => (retVal += `${x},`))
		retVal = retVal.slice(0, retVal.length - 1)
		retVal += ']'

		return retVal
	}

	output += '{'
	array.forEach(x => (output += `${_formatArray(x)},`))
	if (output.charAt(output.length - 1) !== '{')
		output = output.slice(0, output.length - 1)
	output += '}'

	return output
}

export { print_r, print_l }
