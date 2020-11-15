import { modify, getBorder, getModifications, getResize, toModifcationString } from '../lib/modifiers'
import { resize } from '../lib/modifiers/resize'
import { border } from '../lib/modifiers/border'

describe('Modifiers', () => {
  describe('modify()', () => {
    it('returns valid mapping', () => {
      const options = {
        width: 500,
        height: 500,
        aspectRatio: '16:9',
        crop: 'scale'
      }

      expect(modify(options)).toEqual([
        'c_scale,w_500,h_500',
        'ar_16:9',
      ])
    })

    it('returns modifications with chained', () => {
      const options = {
        width: 500,
        height: 500,
        aspectRatio: '16:9',
        crop: 'scale',
        chaining: [{
          bitRate: 12,
          effect: 'grayscale'
        }, {
          effect: 'pixelate',
          border: {
            width: 1,
            type: 'dashed',
            color: '#fff'
          }
        }]
      }

      expect(modify(options)).toEqual([
        'c_scale,w_500,h_500',
        'ar_16:9',
        ['br_12','e_grayscale'],
        ['bo_1px_dashed_#fff', 'e_pixelate']
      ])
    })
  })

  describe('getBorder()', () => {
    it('will return a default color and size if only width', () => {
      const options = {
        border: {
          width: 10
        }
      }

      expect(getBorder(options)).toEqual('bo_10px_solid_black')
    })

    it('returns the mapped string value if border is a string', () => {
      const options = {
        border: '10px_dotted_black'
      }

      expect(getBorder(options)).toEqual('bo_10px_dotted_black')
    })
  })

  describe('getModifications()', () => {
    it('only return the valid fields', () => {
      const options = {
        bitRate: 12,
        cloudName: 'demo',
        customFunction: 'func',
        fetchFormat: 'auto',
        fallbackContent: '<div>hello</div>',
      }

      expect(getModifications(options)).toEqual([
        'br_12',
        'fn_func',
        'f_auto'
      ])
    })
  })

  describe('getResize()', () => {
    it('should prioritize resize field', () => {
      const options = {
        resize: {
          type: 'crop',
          width: 10,
          height: 10
        },
        width: 20
      }

      expect(getResize(options)).toEqual('c_crop,w_10,h_10')
    })

    it('should support width field', () => {
      const options = {
        width: 20
      }

      expect(getResize(options)).toEqual('w_20')
    })

    it('should support height field', () => {
      const options = {
        height: 20
      }

      expect(getResize(options)).toEqual('h_20')
    })

    it('should support width, height and crop field', () => {
      const options = {
        height: 20,
        width: 20,
        crop: 'scale'
      }

      expect(getResize(options)).toEqual('c_scale,w_20,h_20')
    })
  })  

  describe('toModifcationString()', () => {
    it('returns modifications with chained', () => {
      const options = {
        width: 500,
        height: 500,
        aspectRatio: '16:9',
        crop: 'scale',
        chaining: [{
          bitRate: 12,
          effect: 'grayscale'
        }, {
          effect: 'pixelate',
          border: {
            width: 1,
            type: 'dashed',
            color: '#fff'
          }
        }]
      }

      expect(toModifcationString(modify(options))).toEqual(
        'c_scale,w_500,h_500,ar_16:9/br_12,e_grayscale/bo_1px_dashed_#fff,e_pixelate'
      )
    })
  })
})

describe('resize()', () => {
  it('should return with all options', () => {
    expect(resize({type: 'crop', width: 10, height: 20})).toEqual('c_crop,w_10,h_20')
  })

  it('should return only type and height', () => {
    expect(resize({ type: 'crop', height: 20 })).toEqual('c_crop,h_20')
  })

  it('should return only type and width', () => {
    expect(resize({ type: 'crop', width: '10' })).toEqual('c_crop,w_10')
  })

  it('should not return crop when only width and height', () => {
    expect(resize({ width:10, height: 10 })).toEqual('w_10,h_10')
  })
})

describe('border', () => {
  it('should return a default type and color if only width is passed', () => {
    expect(border({ width: 10 })).toEqual('bo_10px_solid_black')
  })

  it('should return options', () => {
    expect(border({ type: 'dotted', color: 'blue', width: 10 })).toEqual('bo_10px_dotted_blue')
  })
})